---
title: Build a node repository
description: Assemble the four pillars, pin commons, and wire the capture-up flow.
weight: 21
---

**Context:** every [node](/apex/glossary#node) gets exactly one repository. Pick any repository name — [identity](/apex/glossary#node-identity) is declared explicitly in `node.env`, so the repo name is a convention, not a functional input. This guide assembles one from nothing.

{{% steps %}}

### Initialize the repository and pin commons

```bash
git init <node-repo> && cd <node-repo>
git submodule add <commons-url> commons
( cd commons && git fetch --tags && git checkout <release-tag> )
git add .gitmodules commons
mkdir -p proprietaries/actions proprietaries/lib configs compositions/apex .github/workflows
```

The gitlink pins the exact engine version the node runs. Upgrading later means checking out a newer tag inside `commons/` and committing the moved pointer.

### Declare identity

```ini {filename="node.env"}
APEX_NODE_FQDN=node1.example.com
APEX_NODE_HOST=node1.example.com
APEX_SUBNET=198.18.16.0/24
APEX_GIT_AUTHOR_NAME=apex [bot]
APEX_GIT_AUTHOR_EMAIL=apex@localhost
```

`node.env` declares the node's identity explicitly — no domain shape is assumed. `APEX_NODE_FQDN` is the real FQDN used for traefik `Host()` routing (fallback: the OS hostname, with a warning). `APEX_NODE_HOST` is the public host name used for the backup `--host` and the observability/notify `instance` label (default: `APEX_NODE_FQDN`); the short node `name` is its first label. `APEX_SUBNET` is the node's /24 for the `direct` network and is **required** — a missing value exits `66` (see [Concept: Fleet addressing scheme](/apex/concepts/addressing)). `APEX_GIT_AUTHOR_NAME`/`APEX_GIT_AUTHOR_EMAIL` are the capture-up bot identity (generic defaults if unset).

### Write the core wrapper and its env files

```yaml {filename="compositions/apex/docker-compose.yml"}
name: apex
include:
  - ../../commons/compositions/apex/docker-compose.yml
```

```ini {filename="compositions/apex/apex.env"}
APEX_TRAEFIK_DIRECT_IP=198.18.16.10
APEX_RESTIC_REPOSITORY=s3:<endpoint>/<bucket>/<node>
COMPOSE_PROFILES=adguard,xray,alloy
# observability push targets (only when the alloy profile is enabled)
APEX_PROM_PUSH_URL=https://<central-host>/api/v1/push
APEX_LOKI_PUSH_URL=https://<central-host>/loki/api/v1/push
APEX_OBS_BASIC_AUTH_USER=<node-user>
# optional scalars with compose defaults:
# TZ=Etc/UTC
# APEX_RESTIC_COMPRESSION=max
# APEX_RESTIC_AWS_REGION=us-east-1        # set for any non-AWS S3 store
# APEX_RESTIC_AWS_ENDPOINT=                # e.g. an S3-compatible endpoint URL
```

`apex.env` holds committed non-secret scalars only. `COMPOSE_PROFILES` selects which optional core services this node runs — `adguard`, `xray`, `alloy` (the observability push agent), and `manual` (one-shot backups) — and may be empty. Document the uncommitted secret keys in `compositions/apex/SECRETS.md` so an operator on a fresh host knows what to fill in `.env` (`APEX_RESTIC_PASSWORD`, the S3 access keys, `APEX_TRAEFIK_CF_DNS_API_TOKEN`, `APEX_TRAEFIK_ACME_EMAIL`, and `APEX_OBS_BASIC_AUTH_PASS` when observability is on).

### Ignore what never belongs in git

```gitignore {filename=".gitignore"}
**/@tier1
**/@tier2
**/@tier3
**/.env
!compositions/apex/apex.env
__pycache__/
*.pyc
```

### Add the bootstrap script

`init.sh` prepares a fresh clone on the host: `git submodule update --init --recursive`, `git config core.hooksPath commons/githooks`, `git config --global --add safe.directory <repo>`, and prepend `<repo>/commons` to `PATH` in the login shell so `apex` resolves. Mark it executable.

### Start the addressing ledger

Create `compositions/ADDRESSING.md` with the node's subnet (`APEX_SUBNET`) and the reserved ranges (`.10`–`.19` core, `.20`+ services). Every [anchor IP](/apex/glossary#anchor-ip) allocated later is recorded here.

### Wire capture-up CI

Add a scheduled workflow that merges `sync/<node>` into `main` when the branch exists, committing under a bot identity. Check out **without** submodules — the merge only moves the commons pointer, and an SSH submodule URL is not fetchable with the default CI token. See [Concept: Framework architecture](/apex/concepts/architecture) for the full [capture-up](/apex/glossary#capture-up) loop.

### Validate

```bash
./commons/apex --help
```

The listing must show every commons action (plus your proprietaries, once added). Off-host — before `node.env` is filled — expect the harmless warning that `APEX_NODE_FQDN` is unset (the engine falls back to the OS hostname); `APEX_SUBNET` must still be set or the engine exits `66`. Commit the assembled repository on `main`.

{{% /steps %}}

## Notes

- The `proprietaries/` pillar may start empty (keep it present with `.gitkeep` files); the engine treats a missing overlay gracefully.
- Migrate host config sources into `configs/` (`ufw/`, `cron/crontab`, `systemd/`, `crowdsec/`) as the node adopts each `configure/*` step — the actions consume `configs/` verbatim through the template layer.

---

**See also:**

- [Getting started with an apex node](/apex/getting-started)
- [Concept: Framework architecture](/apex/concepts/architecture)
- [Guide: Add a service composition](/apex/guides/service-composition)
