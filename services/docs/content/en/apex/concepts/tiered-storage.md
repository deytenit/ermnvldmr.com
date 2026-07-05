---
title: Tiered storage and privilege isolation
description: The @tier link structure, shared storage, and per-project noroot users.
weight: 16
---

Service data never lives inside a [node](/apex/glossary#node) repository. It lives in three storage [tiers](/apex/glossary#tier) — separate locations chosen per host — and reaches [compositions](/apex/glossary#compositions) through a standardized symlink structure. Ownership of that data is delegated to per-project system users, so no service container writes as root.

## The tier link structure {#links}

`apex tiers/link <tier1> <tier2> <tier3>` builds two layers of links:

- **Node-level:** `compositions/@tierN` → the tier storage root. These are what the engine exposes as `APEX_TIER_ROOT1..3`.
- **Per-project:** for every `compositions/<project>/`, the action creates `<tier-root>/<project>/` and links `compositions/<project>/@tierN` → `<tier-root>/<project>`. Inside each tier it also maintains `shared/` with a per-project subdirectory, and a relative `shared` link inside every project's tier directory pointing back at it.

Each project additionally gets `compositions/<project>/.env` → `<tier1-root>/<project>/.env` (created empty if missing) — the uncommitted secrets file described in [Concept: Compositions](/apex/concepts/compositions). The `@tierN` links and `.env` files are ignored by git; the repository stays pure source.

If a path that should be a symlink exists as a real file or directory, the action warns and asks for confirmation before removing it; declining (including non-interactive EOF) skips that link and continues.

## Users and groups {#users}

`apex tiers/useradd` provisions one locked system user per project — `noroot-<project>` (name sanitized, its own primary group) — plus the fleet-wide `noroot-shared` group every project user joins. It then injects the resolved IDs into the project's `.env` between marker comments, replacing any previous block on re-runs:

```ini {filename="compositions/<project>/.env"}
# START AUTO GENERATED APEX-NOROOT-USERS
APEX_UID=998
APEX_GID=998
APEX_SHARED_GID=997
# END AUTO GENERATED APEX-NOROOT-USERS
```

Compositions consume these as `user: "${APEX_UID?error}:${APEX_GID?error}"` and `group_add: ["${APEX_SHARED_GID?error}"]`.

## The ownership matrix {#ownership}

`apex tiers/chown` enforces ownership across all three tiers. Without arguments it operates on the tier roots (`APEX_TIER_ROOT1..3`); explicit tier paths can override.

| Path | Ownership | Notes |
|---|---|---|
| `<tier-root>` | `root:root` | Directory inode only. |
| `<tier-root>/shared` | `root:root` | Directory inode only — never recursive, so existing project data inside is untouched. |
| `<tier-root>/node-infra` | `root:root` | Recursive. |
| `<tier-root>/<project>` | `uid:gid` | Recursive; IDs read from the project `.env`. |
| `<tier-root>/shared/<project>` | `uid:shared_gid` | Recursive, plus the sticky bit — collaborators can add files but only delete their own. |

Projects with an incomplete `APEX_UID`/`APEX_GID`/`APEX_SHARED_GID` set are skipped with a warning pointing at `tiers/useradd`.

## Engine tier variables {#variables}

| Variable | Resolves to |
|---|---|
| `APEX_TIER_ROOT1..3` | The tier storage roots (`compositions/@tierN`, fully resolved). |
| `APEX_TIER1..3` | The core project's data directories inside each tier (`compositions/apex/@tierN`). |
| `APEX_TIER1..3_SHARED` | The shared area inside the core project's tiers. |

The core composition mounts through these exclusively — for example the backup runner mounts `APEX_TIER_ROOT1` and `APEX_TIER_ROOT2` read-only.

## Backups {#backups}

`apex backup/run <telegram-bot-url>` drives the core `restic` service (profile `manual`, one-shot) end to end:

1. Checks repository reachability with `snapshots`; initializes the repository if needed.
2. Backs up `/data/@tier1` and `/data/@tier2` — the two read-only tier-root mounts — under the node's hostname and a fixed per-node tag.
3. Applies retention with `forget --prune` (7 daily, 4 weekly, 12 monthly).
4. Sends a Telegram status either way; a success whose notification cannot be delivered still exits `1` so schedulers notice.

The repository location and credentials come entirely from `APEX_RESTIC_*` configuration (see [Reference: Environment variables](/apex/reference/environment)). Tier 3 is deliberately outside the backup set — it holds reproducible data such as caches and logs.

---

**See also:**

- [Concept: Security model](/apex/concepts/security-model)
- [Reference: Actions](/apex/reference/actions)
- [Guide: Add a service composition](/apex/guides/service-composition)
