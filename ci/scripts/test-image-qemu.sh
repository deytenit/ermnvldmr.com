#!/usr/bin/env bash
# ==============================================================================
# End-to-End QEMU Verification Script for Golden Image & Cloud-Init User-Data
# ==============================================================================
set -euo pipefail

IMAGE_PATH="${1:-output-qemu/com-ermnvldmr-debian-12-k3s-amd64.qcow2}"
USER_DATA="${2:-ci/cloud-init/user-data.yaml}"
SSH_KEY="${3:-$HOME/.ssh/adam@ermnvldmr.com:ed25519}"
SSH_PORT="${4:-22222}"

if [ ! -f "$IMAGE_PATH" ]; then
  echo "[-] Golden image not found at: $IMAGE_PATH"
  echo "    Build it first using: packer build -var 'accelerator=kvm' ci/packer/debian-12-k3s.pkr.hcl"
  exit 1
fi

if [ ! -f "$USER_DATA" ]; then
  echo "[-] User-data file not found at: $USER_DATA"
  exit 1
fi

if [ ! -f "$SSH_KEY" ]; then
  echo "[-] SSH private key not found at: $SSH_KEY"
  exit 1
fi

# Ensure prerequisite tools exist
for cmd in qemu-system-x86_64 qemu-img genisoimage ssh; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "[-] Required command not found in PATH: $cmd"
    exit 1
  fi
done

TMPDIR=$(mktemp -d /tmp/qemu-test-k3s-XXXXXX)
echo "=== [QEMU Test] Workdir: $TMPDIR ==="

QEMU_PID=""
cleanup() {
  echo "=== [QEMU Test] Cleaning up resources ==="
  if [ -n "$QEMU_PID" ] && kill -0 "$QEMU_PID" 2>/dev/null; then
    echo "Stopping QEMU process (PID: $QEMU_PID)..."
    kill "$QEMU_PID" 2>/dev/null || true
    wait "$QEMU_PID" 2>/dev/null || true
  fi
  rm -rf "$TMPDIR"
  echo "=== [QEMU Test] Cleanup complete ==="
}
trap cleanup EXIT

echo "=== [QEMU Test] 1. Preparing Cloud-Init cidata ISO ==="
cp "$USER_DATA" "$TMPDIR/user-data"
cat << 'EOF' > "$TMPDIR/meta-data"
instance-id: qemu-test-vm-01
local-hostname: com-ermnvldmr
EOF

genisoimage -output "$TMPDIR/cidata.iso" -volid cidata -joliet -rock "$TMPDIR/user-data" "$TMPDIR/meta-data" 2>/dev/null

echo "=== [QEMU Test] 2. Creating Ephemeral Disks ==="
# CoW overlay for root OS disk (preserves original golden image intact)
qemu-img create -f qcow2 -b "$(realpath "$IMAGE_PATH")" -F qcow2 "$TMPDIR/test-os.qcow2" 20G >/dev/null
# Secondary data disk (/dev/vdb) to test persistent storage auto-mounting
qemu-img create -f qcow2 "$TMPDIR/test-vdb.qcow2" 10G >/dev/null

echo "=== [QEMU Test] 3. Launching VM in QEMU (KVM accelerated) ==="
qemu-system-x86_64 \
  -enable-kvm \
  -m 4096 \
  -smp 2 \
  -drive file="$TMPDIR/test-os.qcow2",if=virtio,format=qcow2 \
  -drive file="$TMPDIR/test-vdb.qcow2",if=virtio,format=qcow2 \
  -drive file="$TMPDIR/cidata.iso",if=virtio,format=raw \
  -netdev user,id=net0,hostfwd=tcp::${SSH_PORT}-:22 \
  -device virtio-net,netdev=net0 \
  -nographic \
  -serial file:"$TMPDIR/serial.log" &
QEMU_PID=$!

echo "QEMU started with PID $QEMU_PID. Forwarding guest SSH to localhost:$SSH_PORT"

echo "=== [QEMU Test] 4. Waiting for SSH Availability (up to 120s) ==="
MAX_WAIT=120
WAIT_COUNT=0
SSH_OPTS=(-i "$SSH_KEY" -p "$SSH_PORT" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=3 -o BatchMode=yes)

until ssh "${SSH_OPTS[@]}" adam@127.0.0.1 "echo ssh_ready" 2>/dev/null; do
  sleep 3
  WAIT_COUNT=$((WAIT_COUNT + 3))
  if [ "$WAIT_COUNT" -ge "$MAX_WAIT" ]; then
    echo "[-] Timed out waiting for SSH on localhost:$SSH_PORT!"
    echo "--- Last 50 lines of serial console log ---"
    tail -n 50 "$TMPDIR/serial.log" || true
    exit 1
  fi
done
echo "[+] SSH connection established!"

echo "=== [QEMU Test] 5. Waiting for Cloud-Init Completion ==="
ssh "${SSH_OPTS[@]}" adam@127.0.0.1 "sudo cloud-init status --wait"

echo "=== [QEMU Test] 6. Verifying System Assertions ==="

# Check Hostname
HOSTNAME_ACTUAL=$(ssh "${SSH_OPTS[@]}" adam@127.0.0.1 "hostname")
echo "Hostname: $HOSTNAME_ACTUAL (Expected: com-ermnvldmr)"
[ "$HOSTNAME_ACTUAL" = "com-ermnvldmr" ]

# Check Secondary Disk Mount
MOUNT_CHECK=$(ssh "${SSH_OPTS[@]}" adam@127.0.0.1 "grep -qs '/var/lib/rancher/k3s/storage' /proc/mounts && echo MOUNTED || echo NOT_MOUNTED")
echo "Secondary disk mount: $MOUNT_CHECK"
[ "$MOUNT_CHECK" = "MOUNTED" ]

# Check K3s Node Status
NODE_STATUS=$(ssh "${SSH_OPTS[@]}" adam@127.0.0.1 "kubectl get nodes -o jsonpath='{.items[0].status.conditions[?(@.type==\"Ready\")].status}'")
echo "K3s Node Ready Status: $NODE_STATUS"
[ "$NODE_STATUS" = "True" ]

# Check Non-root Kubectl access
echo "Checking non-root kubectl execution without sudo:"
ssh "${SSH_OPTS[@]}" adam@127.0.0.1 "kubectl get nodes -o wide"

# Check Flux namespace and Age secret
echo "Checking Flux namespace and SOPS Age secret:"
ssh "${SSH_OPTS[@]}" adam@127.0.0.1 "kubectl get secret sops-age -n flux-system"

echo "=========================================================================="
echo "  [SUCCESS] All Golden Image & Cloud-Init Assertions Passed in QEMU!"
echo "=========================================================================="
