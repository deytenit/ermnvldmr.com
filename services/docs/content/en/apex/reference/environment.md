---
title: Environment variables reference
description: Every APEX_* variable, where it is set, and who consumes it.
weight: 33
---

The `APEX_*` namespace is the framework's entire configuration surface. Variables originate in one of four layers; later layers win when the orchestration actions assemble the process environment.

## node.env — identity {#node-env}

Committed at the repository root; read by [node identity](/apex/glossary#node-identity) resolution. The framework is domain-agnostic: a node declares its own FQDN and public host name — there is no cluster concept and no required FQDN shape.

| Variable | Meaning | Notes |
|---|---|---|
| `APEX_NODE_FQDN` | The node's real FQDN (Traefik `Host()` routing) | Falls back to the OS hostname (with a warning) when unset. |
| `APEX_NODE_HOST` | The node's public host name (backup `--host`, obs/notify `instance`) | Defaults to `APEX_NODE_FQDN`. Its first label becomes the short `name`. |
| `APEX_SUBNET` | The node's /24 for the `direct` network | Required, only source of the subnet. Missing = exit `66`. |
| `APEX_GIT_AUTHOR_NAME` | Bot identity for capture-up commits | Generic default (`apex [bot]`). |
| `APEX_GIT_AUTHOR_EMAIL` | Bot identity email for capture-up commits | Generic default (`apex@localhost`). |

## apex.env — committed scalars {#apex-env}

Committed at `compositions/apex/`; non-secret by definition.

| Variable | Meaning | Notes |
|---|---|---|
| `APEX_TRAEFIK_DIRECT_IP` | The edge proxy's [anchor IP](/apex/glossary#anchor-ip) in the node subnet | Required by the core composition (`?error`). |
| `APEX_RESTIC_REPOSITORY` | Backup repository locator | Required (`?error`). |
| `APEX_RESTIC_COMPRESSION` | Restic compression level | Optional; defaults to `max` (fleet policy — `backup/run` also forces `--compression max`). |
| `APEX_RESTIC_AWS_REGION` | S3 backend region | Optional; defaults to `us-east-1`. |
| `APEX_RESTIC_AWS_ENDPOINT` | S3 backend endpoint URL | Optional; defaults to empty (AWS S3). Set for any non-AWS S3-compatible store. |
| `APEX_LOKI_PUSH_URL` | Loki ingest URL for the [Alloy](/apex/concepts/architecture) agent (`loki.write`) | Required by the `alloy` profile (`?error`). |
| `APEX_PROM_PUSH_URL` | Prometheus `remote_write` URL for the Alloy agent | Required by the `alloy` profile (`?error`). |
| `APEX_OBS_BASIC_AUTH_USER` | Basic-auth user for the observability push targets | Required by the `alloy` profile (`?error`). |
| `COMPOSE_PROFILES` | Opt-in core profiles (`adguard`, `xray`, `alloy`) | May be empty; `manual` is activated by `backup/run`, not here. |
| `TZ` | Container timezone | Optional; defaults to `Etc/UTC`. |

## .env — secrets {#secrets}

Uncommitted; a symlink into tier-1 storage. Keys are documented per node in `SECRETS.md`.

| Variable | Meaning | Notes |
|---|---|---|
| `APEX_UID`, `APEX_GID`, `APEX_SHARED_GID` | The project's noroot identity | Auto-injected by `tiers/useradd`; required (`?error`). |
| `APEX_RESTIC_PASSWORD` | Backup repository password | Required (`?error`). |
| `APEX_RESTIC_AWS_ACCESS_KEY_ID`, `APEX_RESTIC_AWS_SECRET_ACCESS_KEY` | Object-storage credentials | Required (`?error`). |
| `APEX_TRAEFIK_CF_DNS_API_TOKEN` | DNS-challenge token for ACME | Required (`?error`). |
| `APEX_TRAEFIK_ACME_EMAIL` | ACME account email | Required (`?error`). |
| `APEX_OBS_BASIC_AUTH_PASS` | Basic-auth password for the observability push targets | Required by the `alloy` profile (`?error`). |
| `APEX_LOKI_BASIC_AUTH` | htpasswd users for the central Loki/Prometheus ingest | Not core-required. Only on a node that itself fronts the central observability ingest. |

## Engine exports — ctx.vars() {#engine}

Computed by the [engine](/apex/glossary#engine) at invocation; exported to `docker compose` by the orchestration actions and available to every template render. Never set these by hand.

| Variable | Value |
|---|---|
| `APEX_NODE_HOST` | The node's public host name (`node.host`); backup `--host` and obs/notify `instance`. |
| `APEX_NODE_FQDN` | The node's real FQDN (`node.fqdn`); used for edge routing rules. |
| `APEX_SUBNET` | Node subnet. |
| `APEX_COMMONS` | Absolute commons directory (`$APEX_COMMONS/apex` is the launcher — crontabs and systemd units use it). |
| `APEX_REPO_ROOT` | Absolute node repository root. |
| `APEX_TIER1`, `APEX_TIER2`, `APEX_TIER3` | Core project data directory per [tier](/apex/glossary#tier). |
| `APEX_TIER1_SHARED`, `APEX_TIER2_SHARED`, `APEX_TIER3_SHARED` | Shared area per tier. |
| `APEX_TIER_ROOT1`, `APEX_TIER_ROOT2`, `APEX_TIER_ROOT3` | Tier storage roots. |

> [!NOTE]
> Variables marked `?error` above are enforced by the shared core composition: `docker compose` refuses to evaluate the model while they are unset, which turns a forgotten secret into an immediate, explicit failure.

Several core-composition variables use `${VAR:-default}` instead, so they are optional and overridable per node: `TZ` (`Etc/UTC`), `APEX_RESTIC_AWS_REGION` (`us-east-1`), `APEX_RESTIC_AWS_ENDPOINT` (empty), `APEX_RESTIC_COMPRESSION` (`max`), and `APEX_ENCLAVE_SUBNET` (`198.18.0.0/16`, the ipallowlist source range for the Traefik dashboard/adguard routes).

---

**See also:**

- [Concept: The execution context](/apex/concepts/execution-context)
- [Concept: Compositions and the shared core](/apex/concepts/compositions)
- [Concept: Node identity resolution](/apex/concepts/node-identity)
