#!/usr/bin/env bash
set -eu
export DEBIAN_FRONTEND=noninteractive

echo "=== Sanitizing Machine Identity & Temporary Files ==="

# Clean APT caches and logs
apt-get autoremove -y --purge
apt-get clean
rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Reset machine-id for unique DHCP lease acquisition on clone
truncate -s 0 /etc/machine-id
rm -f /var/lib/dbus/machine-id
ln -sf /etc/machine-id /var/lib/dbus/machine-id

# Ensure SSH host keys are generated and valid
ssh-keygen -A

# Clean cloud-init logs, state, and reset temporary build DNS
rm -f /etc/resolv.conf
touch /etc/resolv.conf
cloud-init clean --logs || true
rm -rf /var/lib/cloud/instances/*

# Clean bash history
rm -f /root/.bash_history /home/*/.bash_history

# Sync filesystem
sync

echo "=== Cleanup Complete ==="
