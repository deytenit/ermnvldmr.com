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

# Configure cloud-init to support all standard cloud datasources (OpenStack, Ec2, NoCloud, ConfigDrive)
cat << 'EOF' > /etc/cloud/cloud.cfg.d/99-cloud-init.cfg
datasource_list: [ NoCloud, ConfigDrive, OpenStack, Ec2, None ]
disable_vm_template: false
EOF

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

echo "=== Base System Configuration Complete ==="
