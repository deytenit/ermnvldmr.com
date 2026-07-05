---
title: Environment variables reference
description: Every APEX_* variable, where it is set, and who consumes it.
weight: 33
---

The `APEX_*` namespace is the framework's entire configuration surface. Variables originate in one of four layers; later layers win when the orchestration actions assemble the process environment.

## node.env — identity {#node-env}

Committed at the repository root; read by [node identity](/apex/glossary#node-identity) resolution.

| Variable | Meaning | Notes |
|---|---|---|
| `APEX_CLUSTER` | The node's [cluster](/apex/glossary#cluster) (`a1`, `a2`, …) | Mirror of the FQDN's cluster label; the hostname wins on disagreement. |
| `APEX_SUBNET` | The node's /24 inside its cluster block | Authoritative — only source of the subnet. Missing = exit `66`. |

## apex.env — committed scalars {#apex-env}

Committed at `compositions/apex/`; non-secret by definition.

| Variable | Meaning | Notes |
|---|---|---|
| `APEX_TRAEFIK_DIRECT_IP` | The edge proxy's [anchor IP](/apex/glossary#anchor-ip) (`.10` in the node subnet) | Required by the core composition (`?error`). |
| `APEX_RESTIC_REPOSITORY` | Backup repository locator | Required (`?error`). |
| `APEX_RESTIC_COMPRESSION` | Backup compression for manual runs | Optional; defaults to `auto`. |
| `COMPOSE_PROFILES` | Opt-in core profiles (`adguard`, `loki`, `xray`) | May be empty; `manual` is activated by `backup/run`, not here. |

## .env — secrets {#secrets}

Uncommitted; a symlink into tier-1 storage. Keys are documented per node in `SECRETS.md`.

| Variable | Meaning | Notes |
|---|---|---|
| `APEX_UID`, `APEX_GID`, `APEX_SHARED_GID` | The project's noroot identity | Auto-injected by `tiers/useradd`; required (`?error`). |
| `APEX_RESTIC_PASSWORD` | Backup repository password | Required (`?error`). |
| `APEX_RESTIC_AWS_ACCESS_KEY_ID`, `APEX_RESTIC_AWS_SECRET_ACCESS_KEY` | Object-storage credentials | Required (`?error`). |
| `APEX_TRAEFIK_CF_DNS_API_TOKEN` | DNS-challenge token for ACME | Required (`?error`). |
| `APEX_TRAEFIK_ACME_EMAIL` | ACME account email | Required (`?error`). |
| `APEX_LOKI_BASIC_AUTH` | htpasswd users for the `/loki` route | Only when the `loki` profile is enabled. |

## Engine exports — ctx.vars() {#engine}

Computed by the [engine](/apex/glossary#engine) at invocation; exported to `docker compose` by the orchestration actions and available to every template render. Never set these by hand.

| Variable | Value |
|---|---|
| `APEX_NODE` | Node name. |
| `APEX_CLUSTER` | Resolved cluster (post-reconciliation). |
| `APEX_SUBNET` | Node subnet. |
| `APEX_NODE_FQDN` | The observed host FQDN; used for edge routing rules. |
| `APEX_COMMONS` | Absolute commons directory (`$APEX_COMMONS/apex` is the launcher — crontabs and systemd units use it). |
| `APEX_REPO_ROOT` | Absolute node repository root. |
| `APEX_TIER1`, `APEX_TIER2`, `APEX_TIER3` | Core project data directory per [tier](/apex/glossary#tier). |
| `APEX_TIER1_SHARED`, `APEX_TIER2_SHARED`, `APEX_TIER3_SHARED` | Shared area per tier. |
| `APEX_TIER_ROOT1`, `APEX_TIER_ROOT2`, `APEX_TIER_ROOT3` | Tier storage roots. |

> [!NOTE]
> Variables marked `?error` above are enforced by the shared core composition: `docker compose` refuses to evaluate the model while they are unset, which turns a forgotten secret into an immediate, explicit failure.

---

**See also:**

- [Concept: The execution context](/apex/concepts/execution-context)
- [Concept: Compositions and the shared core](/apex/concepts/compositions)
- [Concept: Node identity resolution](/apex/concepts/node-identity)
