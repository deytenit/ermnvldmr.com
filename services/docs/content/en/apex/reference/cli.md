---
title: CLI reference
description: "The apex launcher: listing, dispatch, help, and exit codes."
weight: 31
---

The launcher is a single stdlib-Python script, `commons/apex` (on `PATH` after `init.sh`). Everything it does targets the local checkout — no node argument exists.

## Invocation forms {#invocation}

| Command | Behavior |
|---|---|
| `apex` or `apex --help` | List every available [action](/apex/glossary#action) with its summary; exit `0`. |
| `apex <group>/<action> [args...]` | Dispatch one action. |
| `apex <group>/<action> --help` | Print the action's argparse help generated from its `METADATA`; exit `0`. |

The listing tags each entry with its [overlay](/apex/glossary#overlay) source — no tag (commons), `(local)`, `(local override)` — and appends `[DISABLED: reason]` where a module declares `DISABLED`. Listing uses static `ast` scanning, so no action code executes.

## Layout and path resolution {#layout}

At startup the launcher decides which of two layouts it is in:

- **Node checkout** — the launcher lives in a directory named `commons/` whose parent contains `node.env`. The parent is the repository root; `proprietaries/actions/` is the overlay tree; [node identity](/apex/glossary#node-identity) is resolved before dispatch, and any identity warnings are logged first.
- **Standalone commons** — any other location. The commons directory is its own root, there is no overlay, and `ctx.node` is `None` (log lines carry the `global` prefix).

`sys.path` is assembled as: the commons directory (makes `engine` importable), then `commons/vendor/` when present, then `../proprietaries/` in a node checkout (makes proprietary `lib/` code importable).

## Exit codes {#exit-codes}

| Code | Source |
|---|---|
| `0` | Action returned `0` or a non-integer; `--help` paths. |
| `1` | Unknown action; disabled action; unhandled exception (logged as `Type: message` with the context prefix); non-integer `SystemExit`. |
| `64` | Usage error from argument parsing (`EX_USAGE`). |
| `65` | Data error raised by engine libraries (`EX_DATAERR`) — for example an empty rendered crontab. |
| `66` | Missing input (`EX_NOINPUT`) — for example missing identity fields or an absent ufw config directory. |

Any other code is whatever the action itself returned or raised.

## Log format {#log-format}

All engine and action output follows one line shape:

```text
[<node>] [<group>/<action>] [LEVEL] message
```

`LEVEL` is `INFO`, `WARN`, `ERROR`, or `SUCCESS`; `ERROR` lines go to stderr, everything else to stdout — cron-friendly for both capture and alerting.

---

**See also:**

- [Concept: Actions and the overlay](/apex/concepts/actions-and-overlay)
- [Reference: Actions](/apex/reference/actions)
- [Reference: Engine API](/apex/reference/engine-api)
