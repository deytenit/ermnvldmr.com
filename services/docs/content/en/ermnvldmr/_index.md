---
title: "ermnvldmr.com Platform"
weight: 1
type: docs
cascade:
  type: docs
---

**ermnvldmr.com Platform** is the complete cloud-native infrastructure, automation pipeline, and GitOps delivery system powering all `ermnvldmr.com` production services.

The platform is designed around strict infrastructure-as-code principles, immutable golden OS images, secret encryption at rest, automated continuous reconciliation, and zero-downtime rolling updates.

---

## Documentation Sections

{{% cards %}}
{{< card link="architecture" title="Architecture & Flow" icon="server" subtitle="End-to-end architectural design: Packer, Cloud-Init, K3s, Flux GitOps, and Cloudflare." >}}
{{< card link="golden-image" title="Golden Image Automation" icon="cube" subtitle="Automated QEMU Packer build pipeline, kernel & OS bake-in, S3 artifact storage, and quota management." >}}
{{< card link="deployment-gitops" title="GitOps & Release Engine" icon="refresh" subtitle="Continuous deployment, semantic releases, fast-track deploys, and automated /version.json rollout checks." >}}
{{< card link="operations" title="Operations & Runbook" icon="shield-check" subtitle="SSH access, SOPS age encryption, persistent storage management, database backups, and disaster recovery." >}}
{{% /cards %}}

---

## Key Platform Characteristics

* **Immutable Golden Images**: Standardized Debian 12 + K3s base built via Packer and QEMU, isolated and stored in S3.
* **Autonomous First-Boot Initialization**: Cloud-Init automatically provisions storage, network hardening, firewall, age encryption secrets, and bootstraps Flux GitOps without requiring manual console access.
* **Declarative GitOps Engine**: Flux v2 continuously reconciles Kubernetes cluster state against the `next` branch in GitHub.
* **End-to-End Encryption**: SOPS + Age encrypts all sensitive secrets in Git; Let's Encrypt and Cloudflare Full (Strict) secure all public traffic.
* **Automated Production Rollout Verification**: Release pipelines query public `/version.json` probes to verify that rolling updates actively serve user traffic before finishing.
