---
title: Actions reference
description: "Every commons action: arguments and behavior."
weight: 32
---

The [commons](/apex/glossary#commons) actions, by group. Arguments are shown as the parser accepts them; optional arguments are bracketed. Exit codes follow the [engine convention](/apex/reference/cli#exit-codes).

## configure {#configure}

### configure

`apex configure [--dry-run]`

Runs the suite in order: `base`, `timezone`, `ufw`, `crowdsec`, `cron`, `systemd`, `routing`, then additional node actions. A failing step contributes a nonzero exit status; later steps may still run. `--dry-run` is forwarded only to steps that support it, so it is not a guarantee that the entire umbrella command is read-only.

### configure/base

`apex configure/base`

Debian-only guard (exit `1` elsewhere). Checks installed package state for `curl`, `wget`, `git`, `rsyslog`, and `ufw`; installs missing packages and ensures rsyslog is running. Refuses an APT simulation containing upgrades or removals and uses `--no-upgrade --no-remove`. Avoid concurrent package operations: simulation and installation are separate transactions. Verifies the immutable revision and SHA-256 of `/usr/local/bin/ufw-docker` before running it as root. Unsafe paths and unverified downloads are rejected; an executable file alone is not trusted.

### configure/timezone

`apex configure/timezone [--dry-run]`

Applies the IANA zone named in `configs/timezone` and refreshes active cron after a change. An absent declaration preserves the current timezone; an invalid zone fails before changing it.

### configure/ufw

`apex configure/ufw [--dry-run]`

Applies the node firewall from `configs/ufw/`: `host/host.rules` through plain `ufw`, `host/before.rules`/`after.rules` as self-healing managed blocks inside `/etc/ufw/`, and `docker/*.rules` through `ufw-docker`. Exits `1` when the config root is missing, `66` when exactly one of `docker/`/`host/` is absent, `1` when a `/etc/ufw` target file does not exist. Requires `configure/base` first (checks `ufw` and `ufw-docker`). Finishes with a restart reminder.

### configure/crowdsec

`apex configure/crowdsec [--dry-run]`

Installs CrowdSec via the official script when `cscli` is absent, renders `configs/crowdsec/` into `/etc/crowdsec/` (backing up overwritten files), installs the `crowdsecurity/linux` and `crowdsecurity/traefik` collections, and installs the iptables firewall bouncer when `configs/crowdsec/bouncers/crowdsec-firewall-bouncer.yaml.local` exists and the package is missing. `--dry-run` renders without writing and skips install steps.

### configure/cron

`apex configure/cron [--dry-run]`

Renders `configs/cron/crontab` with `ctx.vars()` and installs it via `crontab -`. Missing source file: exit `1`. Empty render: exit `65`, previous crontab kept. Failed install: previous crontab restored, exit `1`. The rendered result is always printed for review.

### configure/systemd

`apex configure/systemd [--dry-run]`

Renders every top-level, non-hidden file of `configs/systemd/` into `/etc/systemd/system/<name>`; for each `.service` unit it daemon-reloads and enables `--now`. Missing config directory: exit `1`.

### configure/routing

`apex configure/routing`

Enables `net.ipv4.ip_forward`, installs the fwmark `0x1` → routing-table-100 policy rule and the local default route in that table. Both checks are idempotent — re-runs change nothing.

## repository {#repository}

### repository/sync

`apex repository/sync [telegram_bot_url]`

The [capture-up](/apex/glossary#capture-up) action: encrypts modified `.env` and `@tier0` secret files using SOPS, synchronizes each project's `@tier0/.gitignore` to ignore decrypted secrets, enforces `@tier0` guardrails (strict 256 KB limit, no high-churn databases/logs), stages changes, commits under a bot identity when anything changed, rebases onto `origin/main`, updates submodules, and pushes directly to `main`. Aborts (exit `1`) when the commons submodule is dirty, unpinned, or `compositions/` is missing; on a rebase conflict it aborts the rebase and pages via Telegram. Success and every failure path notify when a URL is given.

## package {#package}

### package/sync

`apex package/sync [telegram_bot_url]`

Debian-only. Collects pending apt upgrades (`--just-print`) and out-of-date running container images (local RepoDigest vs the registry digest via `skopeo`), then sends one Telegram digest. Read-only with respect to packages and images. Unhandled failures page via Telegram and exit `1`; so does a failed digest delivery.

## backup {#backup}

### backup/run

`apex backup/run <telegram_bot_url>`

Drives the label-driven `resticontainer` core service one-shot (profile `manual`): repository reachability check with init-if-needed, then a single `backup` in which resticontainer discovers every service carrying `restic.*` compose labels, runs their pre-hooks, stops any container flagged `restic.backup.stop`, resolves the labeled container mounts to host paths, and snapshots the union in one restic run. The snapshot is stamped `--host <APEX_NODE_HOST>`, `--tag biweekly`, `--compression max`. A guard then proves a fresh snapshot for this host actually landed — if no `restic.*` labels were discovered the backup is a silent no-op, so it refuses to report success. Retention follows via `forget --prune` (7 daily / 4 weekly / 12 monthly). Each restic failure pages and exits `1`; success pages too, and a failed success-notification exits `1`.

## tier {#tier}

### tier/link

`apex tier/link <tier1_path> <tier2_path> <tier3_path>`

Builds the whole [tier](/apex/glossary#tier) structure: provisions `compositions/@tier0` and per-project `@tier0` directories (linking `compositions/@tier0/<project>` → `../<project>/@tier0`), node-level `compositions/@tierN` links, per-project tier directories, `shared/` areas with back-links, and per-project `@tierN` links. Existing non-symlink paths prompt for confirmation; declining skips that link.

### tier/useradd

`apex tier/useradd`

Ensures the `noroot-shared` group, then one locked `noroot-<project>` system user per composition project (own primary group, no home, `nologin` shell, member of the shared group). Automatically creates an empty `.env` file (`0600`) if missing, and injects `APEX_UID`/`APEX_GID`/`APEX_SHARED_GID` between managed markers.

### tier/chown

`apex tier/chown [tier1_path] [tier2_path] [tier3_path]`

Applies the ownership matrix (see [Concept: Tiered storage](/apex/concepts/tiered-storage#ownership)) across `@tier0` (`adam:adam` on root, `adam:<gid>` on project trees with `u+rwX,g+rwX,o-rwx`, `adam:root` when `.apex-root-owned` is present) and the external tier roots (`APEX_TIER_ROOT1..3`). Requires `noroot-shared` to exist (exit `1` otherwise); projects with incomplete `.env` identity are skipped with a warning.

## util {#util}

### util/extract-traefik-certs

`apex util/extract-traefik-certs <source_acme> <dest_dir> [telegram_bot_url]`

Extracts the ACME store into per-domain `fullchain.pem`/`privkey.pem` via a containerized dumper, then `chmod 600` on the keys and re-owns the output tree to the invoking user. Missing source: exit `1`. Failures inside the extraction page via Telegram when a URL was given.

### util/lint-docker-compose

`apex util/lint-docker-compose [--hook]`

Three passes: (1) [anchor-IP](/apex/glossary#anchor-ip) validation over `compositions/*/docker-compose.yml` — well-formed, unique, inside the node subnet; (2) `@tier0` guardrail validation (strict 256 KB size cap, zero high-churn/database files, `.gitignore` tracking for decrypted secrets); (3) the `dclint` compose linter with `--fix`, run in a container over the repository (tier links, `@tier0`, `.env`, and the commons submodule excluded). `--hook` restricts pass 3 to staged compose files and re-stages what the linter fixed. The exit code reflects all three passes.

## compose {#compose}

### compose

`apex compose [-p <composition>] [--dry-run] <action> [extra...]`

Without a target, visits core first and other compositions alphabetically, reversed for `down`. `-p` selects one composition or `all`; `up` defaults to detached mode. `.env` is passed per project, with generated identity and path values in the process environment. Remaining arguments pass through to Docker Compose. Wrapper options precede the action; `--dry-run` prints commands without executing them.

Compatibility forms include `apex compose restart apex traefik` and `apex compose up -d apex`. Use explicit `-p` to distinguish a composition from a service or option value.

## env {#env}

`apex env [--export | --dotenv | --write <path> | --sync]`

Default output is shell-quoted APEX exports for `eval "$(apex env)"`. `--dotenv` emits dotenv syntax; `--write` writes generated values to a separate file, including a relative filename. These modes do not read composition credentials.

`--sync` preserves existing `compositions/apex/.env` text and updates only its managed block with synthesized identity and tier path values. Synchronized files use mode `0600`. Resync after changing node identity or tier paths. Malformed managed markers fail without rewriting uncertain content. Shell environment values still have Docker Compose precedence.

---

**See also:**

- [Reference: CLI](/apex/reference/cli)
- [Guide: Operate a node](/apex/guides/host-operations)
- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
