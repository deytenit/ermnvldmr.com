#!/usr/bin/env bash
set -eu
export DEBIAN_FRONTEND=noninteractive

echo "=== Configuring Base System for Cloud Image ==="

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

# Enable serial console getty
systemctl enable serial-getty@ttyS0.service || true

# Configure cloud-init to use NoCloud and ConfigDrive datasources
cat << 'EOF' > /etc/cloud/cloud.cfg.d/99-cloud-init.cfg
datasource_list: [ NoCloud, ConfigDrive, None ]
datasource:
  NoCloud:
    fs_label: cidata
EOF

# Ensure DHCP on eth0
cat << 'EOF' > /etc/network/interfaces.d/eth0
auto eth0
iface eth0 inet dhcp
EOF

echo "=== Base System Configuration Complete ==="
