#!/usr/bin/env bash
set -eu
export DEBIAN_FRONTEND=noninteractive

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

# Create configuration directory and default config
mkdir -p /etc/rancher/k3s
cat << 'EOF' > /etc/rancher/k3s/config.yaml
write-kubeconfig-mode: "0644"
EOF
chmod 644 /etc/rancher/k3s/config.yaml

# Pre-stage default GitOps root sync manifest
mkdir -p /etc/flux
cat << 'EOF' > /etc/flux/cluster-sync.yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: ermnvldmr-repo
  namespace: flux-system
spec:
  interval: 1m
  url: https://github.com/deytenit/ermnvldmr.com.git
  ref:
    branch: next
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: cluster-sync
  namespace: flux-system
spec:
  interval: 1m
  sourceRef:
    kind: GitRepository
    name: ermnvldmr-repo
  path: ./ci/k8s/clusters/production
  prune: true
  wait: true
  timeout: 3m
  decryption:
    provider: sops
    secretRef:
      name: sops-age
EOF

# Install the cluster bootstrap script into /usr/local/bin
cat << 'EOF' > /usr/local/bin/bootstrap-cluster.sh
#!/usr/bin/env bash
set -euo pipefail

echo "=== [Bootstrap] Checking for Secondary Persistent Data Disk ==="
if [ -b /dev/vdb ]; then
  echo "Secondary disk /dev/vdb detected."
  if ! blkid /dev/vdb >/dev/null 2>&1; then
    echo "Formatting /dev/vdb with ext4 filesystem..."
    mkfs.ext4 -F -L k3s-storage /dev/vdb
  fi
  mkdir -p /var/lib/rancher/k3s/storage
  if ! grep -qs '/var/lib/rancher/k3s/storage' /proc/mounts; then
    mount /dev/vdb /var/lib/rancher/k3s/storage
    echo "LABEL=k3s-storage /var/lib/rancher/k3s/storage ext4 defaults,noatime 0 2" >> /etc/fstab
    echo "Mounted /dev/vdb to /var/lib/rancher/k3s/storage."
  fi
fi

echo "=== [Bootstrap] Starting K3s Service ==="
systemctl enable --now k3s.service

echo "=== [Bootstrap] Waiting for K3s API server ready ==="
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
until kubectl get nodes >/dev/null 2>&1; do
  echo "Waiting for Kubernetes API..."
  sleep 2
done

echo "=== [Bootstrap] Cluster node is online ==="
kubectl get nodes

echo "=== [Bootstrap] Setting up Kubectl access for non-root users ==="
for home_dir in /home/*; do
  if [ -d "$home_dir" ]; then
    user_name=$(basename "$home_dir")
    mkdir -p "$home_dir/.kube"
    cp /etc/rancher/k3s/k3s.yaml "$home_dir/.kube/config"
    chown -R "$user_name:$user_name" "$home_dir/.kube"
    chmod 600 "$home_dir/.kube/config"
  fi
done

echo "=== [Bootstrap] Creating flux-system namespace ==="
kubectl create namespace flux-system --dry-run=client -o yaml | kubectl apply -f -

echo "=== [Bootstrap] Injecting SOPS age decryption key ==="
if [ -f /root/.config/sops/age/keys.txt ]; then
  kubectl create secret generic sops-age \
    --namespace=flux-system \
    --from-file=age.agekey=/root/.config/sops/age/keys.txt \
    --dry-run=client -o yaml | kubectl apply -f -
  echo "sops-age secret created."
else
  echo "WARNING: /root/.config/sops/age/keys.txt not found. Inject key manually via kubectl."
fi

echo "=== [Bootstrap] Installing Flux Operator / Custom Resources ==="
kubectl apply -k "https://github.com/fluxcd/flux2/manifests/install?ref=v2.4.0" || true

echo "=== [Bootstrap] Applying initial GitOps root sync ==="
if [ -f /etc/flux/cluster-sync.yaml ]; then
  kubectl apply -f /etc/flux/cluster-sync.yaml
fi

echo "=== [Bootstrap] First-Boot Bootstrap Sequence Complete ==="
EOF

chmod 755 /usr/local/bin/bootstrap-cluster.sh

echo "=== K3s Pre-installation Complete ==="
