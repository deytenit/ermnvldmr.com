---
title: Tiered storage and privilege isolation
description: The @tier link structure, shared storage, and per-project noroot users.
weight: 16
---

Service data and runtime configurations are organized into four storage [tiers](/apex/glossary#tier). Static declarative configuration and encrypted secrets live directly in the node repository on **Tier 0**, while persistent application state, databases, and logs live on three external host storage tiers (**Tier 1** to **Tier 3**) and reach [compositions](/apex/glossary#compositions) through a standardized symlink structure. Ownership of that data is delegated to per-project system users, so no service container writes as root.

## Tier 0 — in-repository configuration and secrets {#tier0}

Unlike external storage tiers `@tier1`–`@tier3`, `compositions/<project>/@tier0/` lives directly inside the node repository and is tracked by Git:

- **Plaintext configuration files** (dynamic Traefik routing rules, Nginx configurations, routing snippets, and templates) containing no secrets are committed directly to `compositions/<project>/@tier0/`.
- **Secret-bearing configuration files** (such as `AdGuardHome.yaml`, Xray `config.jsonc`, `rclone.conf`, `app/config.ini`, `service/settings.yml`, or static internal TLS private keys) are stored in Git as SOPS-encrypted siblings named `<stem>.enc.<ext>` (or `<name>.enc` if extensionless). On the host, they are decrypted to their runtime paths, which are automatically listed in `compositions/<project>/@tier0/.gitignore`.

Tier 0 enforces three strict guardrails validated by `util/lint-docker-compose` (including its pre-commit hook) and `apex repository/sync`:

1. **Strict 256 KB size cap:** individual files in `@tier0` must not exceed 256 KB (`262,144` bytes).
2. **No high-churn state:** databases and WAL journals (`*.db`, `*.db-shm`, `*.db-wal`, `*.sqlite*`, `*.mv.db`), ACME stores (`acme.json`), DNS query logs (`querylog*.json*`), logs, lock/pid/socket files, and backups (`*.log`, `*.pid`, `*.lock`, `*.sock`, `*.bak*`, `*.torrent`) belong on `@tier1` or higher, never in `@tier0`.
3. **Structured SOPS modes first:** SOPS uses native key-value encryption for `dotenv`, `yaml`, `json` (including valid JSON `.jsonc`), and `ini` so diffs stay human-readable, reserving `raw` mode only for unstructured text configs or static private keys.

## The tier link structure {#links}

`apex tier/link <tier1> <tier2> <tier3>` builds the tier link hierarchy:

- **Tier 0:** provisions `compositions/@tier0` and per-project `compositions/<project>/@tier0` directories, linking `compositions/@tier0/<project>` → `../<project>/@tier0`.
- **Node-level external tiers:** `compositions/@tierN` → the external tier storage root (`APEX_TIER_ROOT1..3`).
- **Per-project external tiers:** for every `compositions/<project>/`, the action creates `<tier-root>/<project>/` and links `compositions/<project>/@tierN` → `<tier-root>/<project>`. Inside each tier it also maintains `shared/` with a per-project subdirectory, and a relative `shared` link inside every project's tier directory pointing back at it.

Each project additionally maintains its uncommitted secrets file `compositions/<project>/.env` (mode `0600`), paired with the tracked `compositions/<project>/.enc.env` file described in [Concept: Compositions](/apex/concepts/compositions). The `@tier1..3` links and plaintext `.env` files are ignored by git; the repository stays pure source.

If a path that should be a symlink exists as a real file or directory, the action warns and asks for confirmation before removing it; declining (including non-interactive EOF) skips that link and continues.

## Users and groups {#users}

`apex tier/useradd` provisions one locked system user per project — `noroot-<project>` (name sanitized, its own primary group) — plus the fleet-wide `noroot-shared` group every project user joins. It then injects the resolved IDs into the project's `.env` between marker comments, replacing any previous block on re-runs:

```ini {filename="compositions/<project>/.env"}
# START AUTO GENERATED APEX-NOROOT-USERS
APEX_UID=998
APEX_GID=998
APEX_SHARED_GID=997
# END AUTO GENERATED APEX-NOROOT-USERS
```

Compositions consume these as `user: "${APEX_UID?error}:${APEX_GID?error}"` and `group_add: ["${APEX_SHARED_GID?error}"]`.

If a service in a composition must run as `root` and refuses non-root-owned data directories, place a marker file `compositions/<project>/.apex-root-owned` in the project root. When present, `tier/useradd` skips creating `noroot-<project>`, and `tier/chown` recursively applies `root:root` to external tiers and `adam:root` to `@tier0`.

## The ownership matrix {#ownership}

`apex tier/chown` enforces ownership across all tiers. Without arguments it operates on the tier roots (`APEX_TIER_ROOT0..3`); explicit tier paths can override.

| Path | Ownership | Notes |
|---|---|---|
| `compositions/@tier0` | `adam:adam` | Directory inode only (`0770`). |
| `compositions/<project>/@tier0` | `adam:gid` | Recursive (`u+rwX,g+rwX,o-rwx`); owned by `adam:root` when `.apex-root-owned` is present. |
| `<tier-root>` | `root:root` | Directory inode only. |
| `<tier-root>/shared` | `root:root` | Directory inode only — never recursive, so existing project data inside is untouched. |
| `<tier-root>/node-infra` | `root:root` | Recursive. |
| `<tier-root>/<project>` | `uid:gid` | Recursive; IDs read from the project `.env`. |
| `<tier-root>/shared/<project>` | `uid:shared_gid` | Recursive, plus the sticky bit — collaborators can add files but only delete their own. |

Projects with an incomplete `APEX_UID`/`APEX_GID`/`APEX_SHARED_GID` set are skipped with a warning pointing at `tier/useradd`.

## Engine tier variables {#variables}

| Variable | Resolves to |
|---|---|
| `APEX_TIER_ROOT0` | The in-repository Tier 0 root (`compositions/@tier0`). |
| `APEX_TIER0` | The core project's Tier 0 directory (`compositions/apex/@tier0`). |
| `APEX_TIER_ROOT1..3` | The external tier storage roots (`compositions/@tierN`, fully resolved). |
| `APEX_TIER1..3` | The core project's data directories inside each tier (`compositions/apex/@tierN`). |
| `APEX_TIER1..3_SHARED` | The shared area inside the core project's tiers. |

The core composition mounts through these exclusively; the backup runner instead mounts the fleet data root `/srv` read-only and resolves each labeled service's container mounts back to their host paths.

## Backups {#backups}

`apex backup/run <telegram-bot-url>` drives the core `resticontainer` service (profile `manual`, one-shot) end to end. Backup intent is **label-driven**: resticontainer discovers every service carrying `restic.enable=true`, reads its `restic.backup.paths` (and optional `restic.backup.stop` / `restic.hooks.*`), resolves those container paths to host paths, and snapshots their union in a single restic run.

1. Checks repository reachability with `snapshots`; initializes the repository if needed.
2. Runs `backup` with `--host <APEX_NODE_HOST>` and `--tag biweekly` — resticontainer runs each labeled service's pre-hook, stops any container flagged `restic.backup.stop`, snapshots the resolved host paths, then restarts and runs post-hooks. The run refuses to report success if no new snapshot lands (a guard against zero labels being discovered).
3. Applies retention with `forget --prune` (7 daily, 4 weekly, 12 monthly).
4. Sends a Telegram status either way; a success whose notification cannot be delivered still exits `1` so schedulers notice.

The repository location and credentials come entirely from `APEX_RESTIC_*` configuration (see [Reference: Environment variables](/apex/reference/environment)). Which data is captured is decided per service by its `restic.*` labels — for example the core services back up only their configuration (traefik dynamic rules, xray/adguard config), leaving reproducible tier-3 data such as caches and logs out of the set.

---

**See also:**

- [Concept: Security model](/apex/concepts/security-model)
- [Reference: Actions](/apex/reference/actions)
- [Guide: Add a service composition](/apex/guides/service-composition)
