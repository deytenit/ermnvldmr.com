#!/usr/bin/env bash
set -eu
export DEBIAN_FRONTEND=noninteractive

echo "=== Installing K3s Binary (First-Boot Isolation) ==="

export INSTALL_K3S_SKIP_ENABLE="true"
export INSTALL_K3S_SKIP_START="true"
export INSTALL_K3S_VERSION="v1.31.2+k3s1"

if [ -f /tmp/k3s-install.sh ]; then
    export INSTALL_K3S_SKIP_DOWNLOAD="true"
    export INSTALL_K3S_BIN_DIR="/usr/local/bin"
    sh /tmp/k3s-install.sh
elif [ -x /usr/local/bin/k3s ]; then
    echo "k3s binary already present in /usr/local/bin"
else
    curl -sfL https://get.k3s.io | sh -
fi

# Verify k3s binary is located in /usr/local/bin
which k3s
k3s --version

# Ensure systemd service is NOT running
systemctl stop k3s.service || true
systemctl disable k3s.service || true

# Create configuration directory
mkdir -p /etc/rancher/k3s

echo "=== K3s Pre-installation Complete ==="
