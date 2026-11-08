#!/usr/bin/env bash
set -euo pipefail

mkdir -p output-qemu

echo "Downloading official Debian 12 cloud image..."
curl -fsSL -o base.qcow2 https://cloud.debian.org/images/cloud/bookworm/latest/debian-12-genericcloud-amd64.qcow2

echo "Expanding disk image to 10G..."
qemu-img resize base.qcow2 10G

echo "Connecting disk image via NBD..."
sudo modprobe nbd max_part=8
sudo qemu-nbd --connect=/dev/nbd0 base.qcow2
sleep 1
sudo partx -u /dev/nbd0 || true

echo "Mounting disk filesystem..."
sudo mkdir -p /mnt/target
sudo mount /dev/nbd0p1 /mnt/target

echo "Mounting host virtual filesystems and configuring DNS..."
sudo rm -f /mnt/target/etc/resolv.conf
echo "nameserver 1.1.1.1" | sudo tee /mnt/target/etc/resolv.conf
echo "nameserver 8.8.8.8" | sudo tee -a /mnt/target/etc/resolv.conf
sudo mount --bind /dev /mnt/target/dev
sudo mount --bind /dev/pts /mnt/target/dev/pts
sudo mount --bind /proc /mnt/target/proc
sudo mount --bind /sys /mnt/target/sys

echo "Copying provisioner scripts..."
sudo mkdir -p /mnt/target/tmp/scripts
sudo cp ci/packer/scripts/*.sh /mnt/target/tmp/scripts/
sudo cp /opt/ci/assets/k3s /opt/ci/assets/k3s-install.sh /mnt/target/tmp/scripts/
sudo cp /opt/ci/assets/flux-install-local.yaml /mnt/target/tmp/scripts/flux-install.yaml
sudo chmod +x /mnt/target/tmp/scripts/*.sh

echo "Running provisioner scripts in chroot..."
sudo chroot /mnt/target /bin/bash /tmp/scripts/01-base-system.sh
sudo chroot /mnt/target /bin/bash /tmp/scripts/02-install-k3s.sh
sudo chroot /mnt/target /bin/bash /tmp/scripts/03-cleanup.sh
sudo rm -rf /mnt/target/tmp/scripts

echo "Unmounting filesystems..."
sudo umount /mnt/target/sys
sudo umount /mnt/target/proc
sudo umount /mnt/target/dev/pts
sudo umount /mnt/target/dev
sudo umount /mnt/target
sudo qemu-nbd --disconnect /dev/nbd0

echo "Compressing and optimizing qcow2 with 2M cluster size..."
qemu-img convert -f qcow2 -O qcow2 -o cluster_size=2M -c base.qcow2 output-qemu/com-ermnvldmr-debian-12-k3s-amd64.qcow2
echo "Golden image built successfully."
