---
title: "Operations & Runbook"
weight: 5
type: docs
---

Practical runbook and operational guidelines for managing, debugging, and maintaining the `ermnvldmr.com` production cluster.

---

## 1. Remote SSH Access

Connect to the virtual machine using the administrative `adam` account:

```bash
ssh -i ~/.ssh/adam_ermnvldmr_com_ed25519 adam@158.160.205.138
```

The `adam` user has passwordless `sudo` privileges and automatically configured `kubectl` credentials in `~/.kube/config`.

---

## 2. Cluster Health Inspection

### Check Pod Status
```bash
kubectl get pods -n com-ermnvldmr -o wide
```

### Check Ingress & TLS Certificates
```bash
kubectl get certificates -n com-ermnvldmr
kubectl get ingress -n com-ermnvldmr
```

### Check Flux GitOps Sync Status
```bash
kubectl get gitrepositories -n flux-system
kubectl get kustomizations -n flux-system
```

### Force Immediate GitOps Reconciliation
```bash
kubectl annotate --overwrite kustomization -n flux-system cluster-sync reconcile.fluxcd.io/requestedAt="$(date +%s)"
```

---

## 3. Secret Management with SOPS + Age

All sensitive files (`*.sops.yaml`) are committed directly to Git using SOPS with Age asymmetric encryption.

### SOPS Configuration (`.sops.yaml`):
```yaml
creation_rules:
  - path_regex: 'ci/k8s/.*secret.*\.yaml$'
    encrypted_regex: '^(data|stringData)$'
    age: 'age1jpa7hqyzzdfq7lvnw3l8qy6648mtjgpcqnljl5jz92dcqjrnsqfsn7m0fl'
```

> **Important**: The `encrypted_regex` rule preserves `apiVersion`, `kind`, and `metadata.name` in plaintext so Kustomize and Flux can inspect and route resources without pre-parsing errors.

### Encrypting a Secret
```bash
sops --encrypt --in-place ci/k8s/apps/postgres/secret.sops.yaml
```

### Editing an Encrypted Secret
```bash
sops ci/k8s/apps/postgres/secret.sops.yaml
```

---

## 4. PostgreSQL Storage & S3 Backups

### Storage Architecture
* PostgreSQL data resides on a persistent 5Gi PVC backed by `/dev/vdb` (mounted at `/var/lib/rancher/k3s/storage`).
* Storage survives VM restarts and node maintenance.

### Automated Daily S3 Backup CronJob
* Manifest: [`ci/k8s/apps/postgres/backup-cronjob.yaml`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/k8s/apps/postgres/backup-cronjob.yaml).
* Runs daily at 03:00 UTC (`0 3 * * *`).
* Executes `pg_dump` with gzip compression and uploads directly to `s3://<bucket>/backups/postgres/`.

### Manual Backup Trigger
```bash
kubectl create job --from=cronjob/postgres-backup manual-backup-$(date +%s) -n com-ermnvldmr
```

---

## 5. Cloudflare SSL/TLS Configuration

* **SSL Mode**: **Full (strict)**
* **HTTPS Redirect Bypass Rule**: Ensure an exception rule exists for ACME HTTP-01 challenges:
  ```text
  http.request.scheme eq "http" and not starts_with(http.request.uri.path, "/.well-known/acme-challenge/")
  ```
  This allows cert-manager to renew Let's Encrypt certificates over port 80 without being redirected or blocked.
