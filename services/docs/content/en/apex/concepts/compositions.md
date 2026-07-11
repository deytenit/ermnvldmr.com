---
title: Compositions and the shared core
description: The include-based core composition, profiles, networks, and env layering.
weight: 15
---

A node's runtime is declared as [compositions](/apex/glossary#compositions): one docker-compose project per service under `compositions/<project>/`, plus the [core composition](/apex/glossary#core-composition) — the edge and infrastructure services every node needs. The core lives in the [commons](/apex/glossary#commons) and is consumed per node through a thin wrapper, so its definition is written once and versioned with the framework.

## The include wrapper {#include}

Each node's `compositions/apex/docker-compose.yml` is three lines:

```yaml {filename="compositions/apex/docker-compose.yml"}
name: apex
include:
  - ../../commons/compositions/apex/docker-compose.yml
```

The shared file is fully `${APEX_*}`-parameterized and contains no relative host paths — every mount resolves through variables the [engine](/apex/glossary#engine) exports at invocation, so the same file is correct on every node.

A structural outlier — a node that genuinely needs to change a core service, such as publishing an extra host port — layers an override through the include path-list form instead of editing the shared file:

```yaml {filename="compositions/apex/docker-compose.yml"}
name: apex
include:
  - path:
      - ../../commons/compositions/apex/docker-compose.yml
      - ./traefik.override.yml
```

> [!NOTE]
> The `include:` directive requires Docker Compose v2.20 or newer.

## Core services and profiles {#core-services}

The core composition defines the fleet's shared service set. Always-on services:

- **traefik** — the edge reverse proxy and the anchor of the `direct` network (always `.10` in the node subnet). It terminates TLS via a DNS challenge, discovers backends through docker labels, and exposes its dashboard on the node FQDN behind an [enclave](/apex/glossary#enclave) IP allowlist.
- **socket-proxy** — a filtered docker-socket proxy; traefik reads container state through it and never touches the socket directly.

Opt-in services, gated by compose profiles a node enables in `COMPOSE_PROFILES` (set in `apex.env`):

| Profile | Service | Role |
|---|---|---|
| `xray` | xray | Host-network proxy edge for the enclave. |
| `adguard` | adguard | DNS filtering, sharing traefik's network namespace; routed at `/adguard` on the node FQDN. |
| `alloy` | alloy | Per-node observability agent (Grafana Alloy). Collects host + container metrics and journal + container logs and **pushes** them outbound to a central Prometheus and Loki (see [Concept: Security model](/apex/concepts/security-model#observability)). Its container `hostname` is set to `APEX_NODE_HOST`, and that value stamps the `node` and `instance` labels on every metric and log stream. |
| `manual` | resticontainer | One-shot label-driven backup runner (`ghcr.io/deytenit/resticontainer`) — never starts with `up`; invoked by the `backup/run` action, which discovers per-service backup intent from `restic.*` compose labels. |

## Networks {#networks}

The core composition owns the three node networks; service compositions reference them by key with `external: true`.

| Network | Type | Purpose |
|---|---|---|
| `direct` | bridge, subnet = `APEX_SUBNET` | Static-[anchor-IP](/apex/glossary#anchor-ip) network; every project's anchor holds a fixed address here (see [Concept: Fleet addressing scheme](/apex/concepts/addressing)). |
| `enclave` | bridge, `internal: true` | Reverse-proxy backend network; traefik reaches labeled services here. |
| `socket` | bridge, `internal: true` | Carries only traefik ↔ socket-proxy traffic. |

Within a project, sibling containers typically join the anchor's network namespace (`network_mode: service:<anchor>`) instead of attaching to networks themselves.

## Environment layering {#env-layering}

Values reach a composition from three layers, in increasing precedence:

1. **`.env`** — uncommitted secrets, a symlink into tier-1 storage (`APEX_RESTIC_*` credentials, `APEX_TRAEFIK_*` tokens, the UID/GID block).
2. **`apex.env`** — committed non-secret scalars (`APEX_TRAEFIK_DIRECT_IP`, `APEX_RESTIC_REPOSITORY`, `COMPOSE_PROFILES`, optional `APEX_RESTIC_COMPRESSION`).
3. **Engine exports** — the `APEX_*` identity and [tier](/apex/glossary#tier) paths from `ctx.vars()`, injected into the process environment by the orchestration actions and therefore winning over both files.

Critical variables carry `?error` markers in the shared file, so a missing secret fails composition config loudly instead of starting a misconfigured container.

## Orchestration {#orchestration}

`apex compose <action>` drives every composition on the node:

- **Order** — the core project first (it owns the networks), then every service composition in alphabetical order; `down` reverses the sequence.
- **Env files** — for each project, `.env` and `apex.env` are passed as `--env-file` when present.
- **`up`** implies `-d`; any extra arguments pass through to `docker compose`.
- **`--dry-run`** prints each command with its working directory instead of executing — accepted anywhere on the command line.

---

**See also:**

- [Concept: Fleet addressing scheme](/apex/concepts/addressing)
- [Guide: Add a service composition](/apex/guides/service-composition)
- [Reference: Environment variables](/apex/reference/environment)
