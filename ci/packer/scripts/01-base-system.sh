#!/usr/bin/env bash
set -eu
export DEBIAN_FRONTEND=noninteractive

echo "=== Configuring Base System for Cloud Image ==="

# Install essential kernel modules and utilities
apt-get update
apt-get install -y --no-install-recommends \
    socat \
    conntrack \
    ipset \
    iptables \
    ufw \
    fail2ban \
    unattended-upgrades \
    curl \
    ca-certificates \
    git \
    isc-dhcp-client \
    tar \
    gzip

# Ensure virtio kernel modules are loaded on boot
cat << 'EOF' > /etc/modules-load.d/virtio.conf
virtio
virtio_net
virtio_blk
virtio_pci
virtiofs
EOF

# Configure GRUB for Serial Console (ttyS0 / COM1) and predictable network names
sed -i 's/^GRUB_CMDLINE_LINUX_DEFAULT=.*/GRUB_CMDLINE_LINUX_DEFAULT="console=tty0 console=ttyS0,115200n8 net.ifnames=0 biosdevname=0"/' /etc/default/grub
sed -i 's/^#GRUB_TERMINAL=.*/GRUB_TERMINAL="console serial"/' /etc/default/grub
echo 'GRUB_SERIAL_COMMAND="serial --speed=115200 --unit=0 --word=8 --parity=no --stop=1"' >> /etc/default/grub
update-grub

# Enable serial console getty with root auto-login for emergency console recovery
mkdir -p /etc/systemd/system/serial-getty@ttyS0.service.d
cat << 'EOF' > /etc/systemd/system/serial-getty@ttyS0.service.d/autologin.conf
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin root --noclear --keep-baud 115200,38400,9600 %I $TERM
EOF
systemctl enable serial-getty@ttyS0.service || true

# Ensure SSH server auto-generates host keys if missing before starting
mkdir -p /etc/systemd/system/ssh.service.d
cat << 'EOF' > /etc/systemd/system/ssh.service.d/10-generate-host-keys.conf
[Service]
ExecStartPre=-/usr/bin/ssh-keygen -A
EOF

# Configure ds-identify to always enable cloud-init unconditionally
mkdir -p /etc/cloud
cat << 'EOF' > /etc/cloud/ds-identify.cfg
policy: enabled
EOF

# Configure cloud-init to support all standard cloud datasources (OpenStack, Ec2, NoCloud, ConfigDrive)
cat << 'EOF' > /etc/cloud/cloud.cfg.d/99-cloud-init.cfg
datasource_list: [ NoCloud, ConfigDrive, OpenStack, Ec2, None ]
disable_vm_template: false
EOF

# Explicitly enable cloud-init systemd services
systemctl enable cloud-init-local.service cloud-init.service cloud-config.service cloud-final.service || true

# Ensure automatic DHCP via systemd-networkd and ifupdown
mkdir -p /etc/systemd/network
cat << 'EOF' > /etc/systemd/network/10-eth.network
[Match]
Name=eth* en*

[Network]
DHCP=yes
EOF
systemctl enable systemd-networkd systemd-resolved || true

# Ensure DHCP on eth0 for legacy ifupdown
mkdir -p /etc/network/interfaces.d
cat << 'EOF' > /etc/network/interfaces.d/eth0
auto eth0
iface eth0 inet dhcp
EOF

# Apply kernel hardening sysctl parameters
cat << 'EOF' > /etc/sysctl.d/99-k3s-hardening.conf
# Network SYN Flood Protection
net.ipv4.tcp_syncookies = 1
# Disable ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
# Disable Source Routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
# Anti-spoofing (Reverse Path Filtering)
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
# Required for K8s pod networking
net.ipv4.ip_forward = 1
# System Hardening
kernel.kptr_restrict = 2
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
fs.inotify.max_user_watches = 524288
fs.inotify.max_user_instances = 512
EOF
sysctl --system || true

# Configure baseline UFW firewall & fail2ban
ufw default deny incoming
ufw default allow outgoing
ufw default allow routed
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP Traefik'
ufw allow 443/tcp comment 'HTTPS Traefik'
ufw allow 6443/tcp comment 'K3s API'
ufw allow in on cni0 || true
ufw allow in on flannel.1 || true
ufw allow from 10.42.0.0/16 comment 'K3s Pod CIDR'
ufw allow from 10.43.0.0/16 comment 'K3s Service CIDR'
ufw --force enable
systemctl enable fail2ban || true

echo "=== Base System Configuration Complete ==="
