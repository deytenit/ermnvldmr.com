---
title: Security & privilege isolation
description: Security measures, privilege isolation, and project-level sandboxing.
weight: 20
---

Security in Root is achieved through strict privilege isolation and project-level "sandboxing" to mitigate the impact of service compromises.

## The "No-Root" principle {#noroot}

Running applications as `root` inside containers is a significant security risk. The framework enforces isolation via the `tiers/useradd` and `tiers/chown` actions.

### Project-specific users

Every project (e.g., `traefik`, `synapse`) is assigned a dedicated system user on the host. 

- **Isolation**: If a container is compromised, the attacker only gains the privileges of that specific low-privileged user.
- **Filesystem safety**: Projects can only read/write to their own directories within the [Tiers](/root/glossary#tier).

## Docker socket protection {#socket-protection}

Direct access to `/var/run/docker.sock` is equivalent to root access on the host. To prevent services from abusing this access, the framework utilizes a **Socket Proxy**.

- **Restricted API**: The proxy filters Docker API calls, allowing only necessary operations (e.g., `GET containers`) and blocking dangerous ones (e.g., `POST containers/create`).

## Network hardening {#networking}

Root uses `configure/ufw` to implement a "Default Deny" policy.

- **Internal routing**: Services communicate over a dedicated `root-direct` bridge network.
- **TProxy integration**: Outgoing traffic is routed through Xray for enclave-like isolation and granular routing rules.

---

**See also:**

- [Concept: Tiered storage](/root/concepts/tiered-storage)
- [Guide: Action development](/root/guides/action-development)
