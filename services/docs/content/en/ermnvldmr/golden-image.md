---
title: "Golden Image Automation"
weight: 3
type: docs
---

The `ermnvldmr.com` golden image pipeline automates the generation of standardized, hardened Debian 12 virtual machine images pre-configured for single-node K3s clustering.

---

## 1. Packer Configuration & Provisioning Pipeline

Golden images are defined in [`ci/packer/`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/packer/) and built using the `qemu` Packer builder.

### Key Files:
* **[`debian-12-k3s.pkr.hcl`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/packer/debian-12-k3s.pkr.hcl)**: Main Packer template specifying CPU, RAM, disk size (10GB qcow2), Debian 12 Netinst ISO, boot commands, and provisioner sequence.
* **[`http/preseed.cfg`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/packer/http/preseed.cfg)**: Debian automated preseed installation rules (minimal system, non-interactive partitioning, APT mirrors).
* **[`scripts/01-base-system.sh`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/packer/scripts/01-base-system.sh)**: Base system package installation, cloud-init forced policy enablement (`/etc/cloud/ds-identify.cfg`), kernel optimization, and fail2ban setup.
* **[`scripts/02-install-k3s.sh`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/packer/scripts/02-install-k3s.sh)**: Downloads and installs the K3s binary (`INSTALL_K3S_SKIP_ENABLE=true`, `INSTALL_K3S_SKIP_START=true`) so the binary is baked into `/usr/local/bin/k3s` without creating a cluster during image build.
* **[`scripts/03-cleanup.sh`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/packer/scripts/03-cleanup.sh)**: Machine identity reset (`/etc/machine-id`, `/var/lib/dbus/machine-id`, `/etc/ssh/ssh_host_*`), cache purging, and zeroing free space for maximum image compression.

---

## 2. GitHub Actions Automation

The image build is executed via `.github/workflows/ci-next-build-golden-image.yml`.

### Workflow Stages:
1. **Validate Provisioner Scripts**: Verifies bash syntax (`bash -n ci/packer/scripts/*.sh`) and Packer template formatting (`packer fmt -check`).
2. **Build Golden Image**:
   * Initializes Packer plugins (`packer init`).
   * Runs headless QEMU virtual machine build (`packer build`).
   * Compresses the output artifact to `qcow2`.
3. **S3 Storage Upload & Quota Management**:
   * Configures AWS S3 CLI with S3-compatible Object Storage credentials.
   * **Automatic Quota Pruning**: Removes older images matching `dev/images/com-ermnvldmr-debian-12-k3s-amd64-*.qcow2` before uploading to prevent exceeding bucket limits.
   * **Uploads**: The newly baked image is pushed to:
     ```text
     s3://<bucket>/dev/images/com-ermnvldmr-debian-12-k3s-amd64-<git_short_sha>.qcow2
     ```

---

## 3. Naming Convention

Images follow a deterministic naming structure based on the git commit:

```text
com-ermnvldmr-debian-12-k3s-amd64-<short_sha>.qcow2
```

Example: `com-ermnvldmr-debian-12-k3s-amd64-f4ba6d1.qcow2`

---

## 4. First-Boot Cloud-Init Integration

When launching a compute instance from the uploaded golden image in your cloud infrastructure:
1. Pass the instantiated [`user-data.template.yaml`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/cloud-init/user-data.template.yaml) in the instance metadata under `user-data`.
2. Cloud-init executes `/usr/local/bin/bootstrap-cluster.sh` autonomously on first boot.
3. The instance initializes the network, formats persistent SSDs, starts K3s, installs Flux, and syncs production workloads within ~90 seconds.
