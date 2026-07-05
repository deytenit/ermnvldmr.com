---
title: Security model
description: Privilege isolation, firewall management, intrusion detection, and secret handling.
weight: 18
---

apex hardens a [node](/apex/glossary#node) in independent layers: filesystem privilege isolation, a managed host firewall, intrusion detection, container-level containment, and a strict secrets boundary. Each layer is applied by an [action](/apex/glossary#action) and is therefore reproducible and re-runnable.

## Privilege isolation {#privilege}

Every project runs as its own locked `noroot-<project>` system user; shared storage is group-writable with the sticky bit so projects can exchange files without being able to delete each other's. The full mechanism — users, groups, and the ownership matrix — is described in [Concept: Tiered storage](/apex/concepts/tiered-storage).

## Host firewall {#firewall}

`apex configure/ufw` applies the node's firewall from the `configs/ufw/` pillar in three parts:

- **Host rules** (`configs/ufw/host/host.rules`) — plain `ufw` commands, one per line, applied in order.
- **Kernel-level rule blocks** (`configs/ufw/host/before.rules`, `after.rules`) — injected into `/etc/ufw/before.rules` and `/etc/ufw/after.rules` as managed marker blocks. Injection is **self-healing**: every previous managed block — including blocks left by predecessor tooling — is removed before the fresh block is inserted after ufw's `# End required lines` anchor, and a timestamped `.bak` of the target is kept beside it.
- **Container rules** (`configs/ufw/docker/*.rules`) — applied through `ufw-docker`, which translates them into rules that survive Docker's own iptables manipulation. `configure/base` installs the helper to `~/.local/bin/ufw-docker`.

Missing configuration is an error, not a silent skip: an absent `docker/` or `host/` directory exits `66` when its counterpart exists, and a missing `/etc/ufw` target file aborts the run. The action finishes with a reminder that `ufw` must be restarted to take effect — and that the SSH port must be allowed first.

## Intrusion detection {#crowdsec}

`apex configure/crowdsec` installs CrowdSec through its official installer when `cscli` is absent, renders everything under `configs/crowdsec/` into `/etc/crowdsec/` (acquisition sources, parsers, bouncer configuration), and installs the `crowdsecurity/linux` and `crowdsecurity/traefik` collections. When the node's configs include a firewall-bouncer configuration, the matching bouncer package is installed as well, closing the loop from detection to blocking.

## Container containment {#containers}

The [core composition](/apex/glossary#core-composition) encodes container-level hardening:

- The edge proxy never touches the Docker socket: it discovers backends through a **filtered socket proxy** that exposes read-only container/service state on an isolated network.
- `enclave` and `socket` are `internal: true` networks — no egress, no host port exposure.
- Core services set `no-new-privileges` and run under the project's noroot identity wherever the workload allows; capabilities are granted per service, not globally.
- The optional log route (`/loki`) is protected by HTTP basic auth on top of TLS.

## Secrets boundary {#secrets}

- Secrets live only in per-project `.env` files, which are **symlinks into tier-1 storage** — outside the repository working tree and covered by `.gitignore` (`**/.env`).
- Each node repository documents its expected keys in `SECRETS.md`; the file documents names, never values.
- Committed configuration (`apex.env`) is restricted to non-secret scalars.
- The shared composition marks critical secrets with `?error`, so a missing value fails fast at compose-config time.
- [Capture-up](/apex/glossary#capture-up) commits are safe by construction: the ignored `.env` links and tier data never enter the git index.

---

**See also:**

- [Concept: Tiered storage and privilege isolation](/apex/concepts/tiered-storage)
- [Concept: Compositions and the shared core](/apex/concepts/compositions)
- [Reference: Actions](/apex/reference/actions)
