---
title: Getting started with an apex node
description: Bootstrap a node repository and bring a host under apex management.
weight: 5
---

This quick start takes a fresh host from a cloned [node](/apex/glossary#node) repository to a running service stack. It assumes the node repository already exists — to build one from scratch, see [Guide: Build a node repository](/apex/guides/node-repository).

## Prerequisites

- A Debian-based host whose FQDN follows the [node identity](/apex/glossary#node-identity) shape `<node>.a<x>.apex.ermnvldmr.com`.
- `git` and Python 3 — the [engine](/apex/glossary#engine) uses the standard library only; `pip` is never required.
- Docker with Compose v2.20 or newer (the [core composition](/apex/glossary#core-composition) is consumed through the `include:` directive).
- A sudo-capable login user.
- Three storage locations for the [tiers](/apex/glossary#tier) (for example, three mount points).

## Bootstrap

{{% steps %}}

### Clone the node repository

```bash
git clone --recurse-submodules git@github.com:<owner>/<node>.apex.ermnvldmr.com.git
cd <node>.apex.ermnvldmr.com
./init.sh
source ~/.bashrc
```

`init.sh` initializes the `commons/` submodule, points `core.hooksPath` at `commons/githooks`, marks the checkout `safe.directory`, and prepends `commons/` to `PATH` — the launcher is `commons/apex`.

### Verify action discovery

```bash
apex --help
```

The listing shows every [commons](/apex/glossary#commons) action plus any node-local [proprietaries](/apex/glossary#proprietaries) tagged `(local)`. Off a live host the engine warns that the FQDN is not apex-shaped and falls back to the repository directory name — harmless on a workstation, wrong on the node itself.

### Link the storage tiers

```bash
apex tiers/link <tier1-path> <tier2-path> <tier3-path>
```

Creates the node-level `compositions/@tierN` links, the per-project tier directories and `@tierN` links, `shared/` areas, and each project's `.env` symlink into tier 1. Success ends with `@tier setup completed.`

### Provision project users

```bash
apex tiers/useradd
apex tiers/chown
```

`tiers/useradd` creates one `noroot-<project>` system user per composition plus the `noroot-shared` group, and injects `APEX_UID`/`APEX_GID`/`APEX_SHARED_GID` into each project `.env`. `tiers/chown` then applies the ownership matrix (see [Concept: Tiered storage](/apex/concepts/tiered-storage)) and ends with `Permissions applied.`

### Fill the core secrets

Edit `compositions/apex/.env` (a symlink into tier-1 storage, never committed) with the keys documented in the node repository's `SECRETS.md`:

```ini {filename="compositions/apex/.env"}
APEX_RESTIC_PASSWORD=...
APEX_RESTIC_AWS_ACCESS_KEY_ID=...
APEX_RESTIC_AWS_SECRET_ACCESS_KEY=...
APEX_TRAEFIK_CF_DNS_API_TOKEN=...
APEX_TRAEFIK_ACME_EMAIL=...
```

`APEX_UID`/`APEX_GID`/`APEX_SHARED_GID` are already present — `tiers/useradd` maintains them between marker comments.

### Configure the host

```bash
apex configure
```

Runs every `configure/*` action in fixed order: `base`, `ufw`, `crowdsec`, `cron`, `systemd`, `routing`. Each step is also individually invocable; several accept `--dry-run`. See [Guide: Operate a node](/apex/guides/host-operations).

### Bring the stack up

```bash
apex compose up
```

The core composition comes up first (it owns the networks), then every service composition in alphabetical order.

{{% /steps %}}

## Validation

- `apex --help` lists actions without warnings on the live host.
- `docker ps` shows the core containers (`apex-traefik`, `apex-socket-proxy`, plus any profile-enabled services) and each project's anchor.
- `apex utils/lint-docker-compose` reports `Anchor IP validation passed.`

---

**See also:**

- [Guide: Build a node repository](/apex/guides/node-repository)
- [Concept: Framework architecture](/apex/concepts/architecture)
- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
