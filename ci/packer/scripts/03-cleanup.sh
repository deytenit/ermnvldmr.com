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

# Reset DNS with reliable fallback resolvers
rm -f /etc/cloud/cloud-init.disabled /run/systemd/generator*/cloud-init.disabled
cat << 'EOF' > /etc/resolv.conf
nameserver 1.1.1.1
nameserver 8.8.8.8
nameserver 77.88.8.8
EOF
cloud-init clean --logs --seed || true
rm -rf /var/lib/cloud/*

# Clean bash history
rm -f /root/.bash_history /home/*/.bash_history

# Sync filesystem
sync

echo "=== Cleanup Complete ==="
