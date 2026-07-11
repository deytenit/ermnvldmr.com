---
title: The execution context
description: ctx — the single seam between an action and the host.
weight: 14
---

Every [action](/apex/glossary#action) receives a `ctx` object as its first argument. It is the only sanctioned way to touch the host: logging, process execution, template rendering, file mutation, firewall and service management, and notifications all go through it. Actions therefore stay declarative, and behavior that must be consistent fleet-wide (log format, backup discipline, notification payloads) lives in one place — the [engine](/apex/glossary#engine).

## Members {#members}

| Member | Purpose |
|---|---|
| `ctx.log` | Prefixed logging: `[<node>] [<action>] [LEVEL] message`; errors go to stderr, everything else to stdout. |
| `ctx.sys` | Process execution (`run`, `sudo`, `ok`), systemd service helpers, and idempotent package installation. |
| `ctx.tpl` | Template rendering over the `configs/` pillar with `string.Template.safe_substitute`. |
| `ctx.host` | Idempotent host mutation: timestamped backups, atomic file writes, marker-block injection, crontab installation with rollback. |
| `ctx.ufw` | Host and container firewall application (see [Concept: Security model](/apex/concepts/security-model)). |
| `ctx.crowdsec` | CrowdSec installation, config deployment, and collection management. |
| `ctx.systemd` | Rendering and enabling systemd units from `configs/systemd/`. |
| `ctx.notify` | Telegram notifications; every method returns a boolean so actions can gate their exit code on delivery. |
| `ctx.paths` | Resolved repository paths: `repo_root`, `commons`, `proprietaries`, `configs`, `compositions`, `core`, and the tier properties. |
| `ctx.node` | The resolved [node identity](/apex/glossary#node-identity) record (`name`, `subnet`, `fqdn`, `host`); `None` in a standalone commons checkout. |
| `ctx.commons` | Available only in an overriding proprietary action: `ctx.commons.run(args)` delegates to the shadowed commons implementation. |

Method-level signatures are listed in [Reference: Engine API](/apex/reference/engine-api).

## Template semantics {#templates}

`ctx.tpl` renders files from `configs/` with Python's `string.Template.safe_substitute`:

- Known `$VAR` and `${VAR}` references are replaced.
- **Unknown references stay literal.** A typo in a template survives into the rendered output where it is visible, instead of silently collapsing to an empty string.
- Shell command substitution (`$(...)`) passes through untouched, which keeps crontab entries with embedded `$(cat ...)` intact.

The substitution set is `ctx.vars()` — the full process environment plus the engine-provided `APEX_*` values below. Loops and conditionals never live in templates; they belong in the action.

## The variable export {#vars}

`ctx.vars()` returns the environment used for every template render, and its `APEX_*` subset is exported to `docker compose` by the orchestration actions. On a node it contains:

| Variable | Value |
|---|---|
| `APEX_COMMONS` | Absolute path of the commons directory (the launcher lives at `$APEX_COMMONS/apex`). |
| `APEX_REPO_ROOT` | Absolute path of the node repository root. |
| `APEX_NODE_HOST`, `APEX_NODE_FQDN`, `APEX_SUBNET` | The resolved identity fields. |
| `APEX_TIER1`…`APEX_TIER3` | The core project's per-[tier](/apex/glossary#tier) data directories. |
| `APEX_TIER1_SHARED`…`APEX_TIER3_SHARED` | The shared areas inside each tier. |
| `APEX_TIER_ROOT1`…`APEX_TIER_ROOT3` | The tier storage roots (node-level links). |

The full origin/consumer matrix is in [Reference: Environment variables](/apex/reference/environment).

## Host mutation discipline {#host}

`ctx.host` encodes the framework's write rules:

- **Atomic writes.** `write_file` renders to a temporary file (mode `0644`, matching what a root shell redirect would create) and installs it with `mv` or `sudo cp`; overwriting an existing file preserves that file's mode.
- **Timestamped backups.** When requested, the previous file is kept next to the target as `<name>.<epoch>.bak` before the write.
- **Marker-block injection.** Managed blocks inside system files (for example `/etc/ufw/before.rules`) are delimited by start/end marker comments. Injection removes every prior managed block — including blocks left by predecessor tooling — before inserting the fresh one after its anchor line, so re-runs never accumulate.
- **Crontab rollback.** `install_crontab` snapshots the current crontab, refuses an empty render (exit `65`), previews the result, and restores the snapshot if installation fails.

## Notifications {#notifications}

`ctx.notify` posts Telegram messages through the standard library (`urllib`). Payloads carry the instance name — the node's public host `APEX_NODE_HOST` — a status (`firing`/`resolved`), an escalation level, and the message truncated to 200 characters. Every method returns `True` only when the send succeeded; unattended actions treat a failed send of their final status message as a failure (exit `1`), so a broken notification channel is noticed instead of silently tolerated.

---

**See also:**

- [Reference: Engine API](/apex/reference/engine-api)
- [Reference: Environment variables](/apex/reference/environment)
- [Concept: Actions and the overlay](/apex/concepts/actions-and-overlay)
