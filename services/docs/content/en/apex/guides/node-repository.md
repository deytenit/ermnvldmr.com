---
title: Build a node repository
description: Assemble the four pillars, pin commons, and wire the capture-up flow.
weight: 21
---

**Context:** every [node](/apex/glossary#node) gets exactly one repository, named `<node>.apex.ermnvldmr.com` — the [engine](/apex/glossary#engine)'s identity fallback reads the directory name, so the name is functional, not cosmetic. This guide assembles one from nothing.

{{% steps %}}

### Initialize the repository and pin commons

```bash
git init <node>.apex.ermnvldmr.com && cd <node>.apex.ermnvldmr.com
git submodule add <commons-url> commons
( cd commons && git fetch --tags && git checkout <release-tag> )
git add .gitmodules commons
mkdir -p proprietaries/actions proprietaries/lib configs compositions/apex .github/workflows
```

The gitlink pins the exact engine version the node runs. Upgrading later means checking out a newer tag inside `commons/` and committing the moved pointer.

### Declare identity

```ini {filename="node.env"}
APEX_CLUSTER=a1
APEX_SUBNET=198.18.16.0/24
```

`APEX_SUBNET` is the node's /24 inside its [cluster](/apex/glossary#cluster) block — see [Concept: Fleet addressing scheme](/apex/concepts/addressing). `APEX_CLUSTER` mirrors the cluster carried by the host FQDN.

### Write the core wrapper and its env files

```yaml {filename="compositions/apex/docker-compose.yml"}
name: apex
include:
  - ../../commons/compositions/apex/docker-compose.yml
```

```ini {filename="compositions/apex/apex.env"}
APEX_TRAEFIK_DIRECT_IP=198.18.16.10
APEX_RESTIC_REPOSITORY=s3:<endpoint>/<bucket>/<node>
COMPOSE_PROFILES=adguard,xray
```

`apex.env` holds committed non-secret scalars only; `COMPOSE_PROFILES` selects which optional core services this node runs (it may be empty). Document the uncommitted secret keys in `compositions/apex/SECRETS.md` so an operator on a fresh host knows what to fill in `.env`.

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

Create `compositions/ADDRESSING.md` with the node's subnet, its cluster block, and the reserved ranges (`.10`–`.19` core, `.20`+ services). Every [anchor IP](/apex/glossary#anchor-ip) allocated later is recorded here.

### Wire capture-up CI

Add a scheduled workflow that merges `sync/<node>` into `main` when the branch exists, committing under a bot identity. Check out **without** submodules — the merge only moves the commons pointer, and an SSH submodule URL is not fetchable with the default CI token. See [Concept: Framework architecture](/apex/concepts/architecture) for the full [capture-up](/apex/glossary#capture-up) loop.

### Validate

```bash
./commons/apex --help
```

The listing must show every commons action (plus your proprietaries, once added). Off-host, expect the harmless FQDN-fallback warning. Commit the assembled repository on `main`.

{{% /steps %}}

## Notes

- The `proprietaries/` pillar may start empty (keep it present with `.gitkeep` files); the engine treats a missing overlay gracefully.
- Migrate host config sources into `configs/` (`ufw/`, `cron/crontab`, `systemd/`, `crowdsec/`) as the node adopts each `configure/*` step — the actions consume `configs/` verbatim through the template layer.

---

**See also:**

- [Getting started with an apex node](/apex/getting-started)
- [Concept: Framework architecture](/apex/concepts/architecture)
- [Guide: Add a service composition](/apex/guides/service-composition)
