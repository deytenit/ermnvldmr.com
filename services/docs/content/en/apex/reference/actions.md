---
title: Actions reference
description: "Every commons action: arguments and behavior."
weight: 32
---

The sixteen [commons](/apex/glossary#commons) actions, by group. Arguments are shown as the parser accepts them; optional arguments are bracketed. Exit codes follow the [engine convention](/apex/reference/cli#exit-codes).

## configure {#configure}

### configure

`apex configure [--dry-run]`

Runs the whole suite in fixed order — `base`, `ufw`, `crowdsec`, `cron`, `systemd`, `routing` — and stops at the first failing step, propagating its exit code. `--dry-run` is forwarded to the steps that support it.

### configure/base

`apex configure/base`

Debian-only guard (exit `1` elsewhere). Updates the package index, installs the essential packages (`curl`, `wget`, `git`, `rsyslog`), ensures rsyslog is running, installs `ufw` when absent, and downloads the `ufw-docker` helper to `~/.local/bin/ufw-docker` (skipped when already present).

### configure/ufw

`apex configure/ufw [--dry-run]`

Applies the node firewall from `configs/ufw/`: `host/host.rules` through plain `ufw`, `host/before.rules`/`after.rules` as self-healing managed blocks inside `/etc/ufw/`, and `docker/*.rules` through `ufw-docker`. Exits `1` when the config root is missing, `66` when exactly one of `docker/`/`host/` is absent, `1` when a `/etc/ufw` target file does not exist. Requires `configure/base` first (checks `ufw` and `ufw-docker`). Finishes with a restart reminder.

### configure/crowdsec

`apex configure/crowdsec [--dry-run]`

Installs CrowdSec via the official script when `cscli` is absent, renders `configs/crowdsec/` into `/etc/crowdsec/` (backing up overwritten files), installs the `crowdsecurity/linux` and `crowdsecurity/traefik` collections, and installs the iptables firewall bouncer when `configs/crowdsec/bouncers/crowdsec-firewall-bouncer.yaml.local` exists and the package is missing. `--dry-run` renders without writing and skips install steps.

### configure/cron

`apex configure/cron [--dry-run]`

Renders `configs/cron/crontab` with `ctx.vars()` and installs it via `crontab -`. Missing source file: exit `1`. Empty render: exit `65`, previous crontab kept. Failed install: previous crontab restored, exit `1`. The rendered result is always printed for review.

### configure/systemd

`apex configure/systemd [--dry-run]`

Renders every top-level, non-hidden file of `configs/systemd/` into `/etc/systemd/system/<name>`; for each `.service` unit it daemon-reloads and enables `--now`. Missing config directory: exit `1`.

### configure/routing

`apex configure/routing`

Enables `net.ipv4.ip_forward`, installs the fwmark `0x1` → routing-table-100 policy rule and the local default route in that table. Both checks are idempotent — re-runs change nothing.

## sync {#sync}

### sync/repository

`apex sync/repository <telegram_bot_url>`

The [capture-up](/apex/glossary#capture-up) commit: switches to (or creates) `sync/<node>`, stages the whole tree plus the refreshed commons submodule pointer, commits under a bot identity when anything changed, rebases onto `origin/main`, updates submodules, and pushes with `--force-with-lease`. Aborts (exit `1`) when the commons submodule is dirty or `compositions/` is missing; on a rebase conflict it aborts the rebase and pages via Telegram. Success and every failure path notify; a failed success-notification also exits `1`.

### sync/packages

`apex sync/packages <telegram_bot_url>`

Debian-only. Collects pending apt upgrades (`--just-print`) and out-of-date running container images (local RepoDigest vs the registry digest via `skopeo`), then sends one Telegram digest. Read-only with respect to packages and images. Unhandled failures page via Telegram and exit `1`; so does a failed digest delivery.

## backup {#backup}

### backup/run

`apex backup/run <telegram_bot_url>`

Drives the label-driven `resticontainer` core service one-shot (profile `manual`): repository reachability check with init-if-needed, then a single `backup` in which resticontainer discovers every service carrying `restic.*` compose labels, runs their pre-hooks, stops any container flagged `restic.backup.stop`, resolves the labeled container mounts to host paths, and snapshots the union in one restic run. The snapshot is stamped `--host <APEX_NODE_HOST>`, `--tag biweekly`, `--compression max`. A guard then proves a fresh snapshot for this host actually landed — if no `restic.*` labels were discovered the backup is a silent no-op, so it refuses to report success. Retention follows via `forget --prune` (7 daily / 4 weekly / 12 monthly). Each restic failure pages and exits `1`; success pages too, and a failed success-notification exits `1`.

## tiers {#tiers}

### tiers/link

`apex tiers/link <tier1_path> <tier2_path> <tier3_path>`

Builds the whole [tier](/apex/glossary#tier) symlink structure: node-level `compositions/@tierN` links, per-project tier directories, `shared/` areas with back-links, per-project `@tierN` links, and the `.env` symlink into tier 1 (target created when missing). Existing non-symlink paths prompt for confirmation; declining skips that link.

### tiers/useradd

`apex tiers/useradd`

Ensures the `noroot-shared` group, then one locked `noroot-<project>` system user per composition project (own primary group, no home, `nologin` shell, member of the shared group), and injects `APEX_UID`/`APEX_GID`/`APEX_SHARED_GID` into each project `.env` between managed markers.

### tiers/chown

`apex tiers/chown [tier1_path] [tier2_path] [tier3_path]`

Applies the ownership matrix (see [Concept: Tiered storage](/apex/concepts/tiered-storage#ownership)) across the tier roots — defaults are the node-level tier links. Requires `noroot-shared` to exist (exit `1` otherwise); projects with incomplete `.env` identity are skipped with a warning.

## utils {#utils}

### utils/extract-traefik-certs

`apex utils/extract-traefik-certs <source_acme> <dest_dir> [telegram_bot_url]`

Extracts the ACME store into per-domain `fullchain.pem`/`privkey.pem` via a containerized dumper, then `chmod 600` on the keys and re-owns the output tree to the invoking user. Missing source: exit `1`. Failures inside the extraction page via Telegram when a URL was given.

### utils/lint-docker-compose

`apex utils/lint-docker-compose [--hook]`

Two passes: (1) [anchor-IP](/apex/glossary#anchor-ip) validation over `compositions/*/docker-compose.yml` — well-formed, unique, inside the node subnet; (2) the `dclint` compose linter with `--fix`, run in a container over the repository (tier links, `.env`, and the commons submodule excluded). `--hook` restricts pass 2 to staged compose files and re-stages what the linter fixed. The exit code reflects both passes.

## compose {#compose}

### compose

`apex compose <action> [--dry-run] [extra...]`

Orchestrates `docker compose <action>` across the node: the core project first, then services alphabetically (reversed for `down`). `up` implies `-d`; `.env`/`apex.env` are passed per project when present; extra arguments pass through; `--dry-run` (accepted in any position) prints commands instead of executing.

---

**See also:**

- [Reference: CLI](/apex/reference/cli)
- [Guide: Operate a node](/apex/guides/host-operations)
- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
