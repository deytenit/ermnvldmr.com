#!/usr/bin/env bash
set -euo pipefail

echo "=== Installing K3s Binary (First-Boot Isolation) ==="

export INSTALL_K3S_SKIP_ENABLE="true"
export INSTALL_K3S_SKIP_START="true"
export INSTALL_K3S_VERSION="v1.31.2+k3s1"

# Download official K3s installer and install binary/systemd unit without starting
curl -sfL https://get.k3s.io | sh -

# Verify k3s binary is located in /usr/local/bin
which k3s
k3s --version

# Ensure systemd service is NOT running
systemctl stop k3s.service || true
systemctl disable k3s.service || true

# Create configuration directory
mkdir -p /etc/rancher/k3s

echo "=== K3s Pre-installation Complete ==="
