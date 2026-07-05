---
title: Develop actions
description: Write, override, and test engine actions in commons or proprietaries.
weight: 22
---

**Context:** all automation ships as [actions](/apex/glossary#action) — one Python module each, dispatched by path. Shared behavior belongs in [commons](/apex/glossary#commons) `actions/`; anything node-specific belongs in that node's `proprietaries/actions/`. Both use the identical contract, and the launcher puts both trees on `sys.path`, so a proprietary action imports `engine.*` exactly like a commons one.

## A minimal action {#minimal}

```python {filename="proprietaries/actions/utils/example.py"}
"""One-line module docstring describing the action."""
import os
from engine.descriptor import Meta, Arg, Flag

METADATA = Meta(
    summary="Copy a rendered config into place.",
    args=[Arg("target_dir", "Destination directory"),
          Flag("--dry-run", "Preview only.")],
)

def run(ctx, args):
    if not os.path.isdir(args.target_dir):
        ctx.log.error(f"No such directory: {args.target_dir}")
        raise SystemExit(66)
    content = ctx.tpl.render("example/config", ctx.vars())
    ctx.host.write_file(os.path.join(args.target_dir, "config"), content,
                        dry_run=args.dry_run, sudo=True)
    ctx.log.success("Config deployed.")
```

The file's path is its name: the module above dispatches as `apex utils/example`. Return `0`/`None` for success, an integer for a specific exit code, or raise `SystemExit(code)`; the [exit-code convention](/apex/concepts/actions-and-overlay#exit-codes) is `64` usage, `65` data error, `66` missing input, `1` general.

## Conventions for unattended actions {#unattended}

Actions that run from cron follow two rules so failures page instead of vanishing:

- **Wrap the body** in `try/except Exception` and send `ctx.notify.error(...)` before re-raising as `SystemExit(1)` — the Python equivalent of a shell ERR trap.
- **Gate the exit code on the final notification**: `ctx.notify.*` returns `False` on delivery failure; a completed run whose status message never arrived should still exit `1`.

```python
    try:
        ...work...
        log.success("Done.")
        if not ctx.notify.success(TITLE, url, "Done.", node):
            raise SystemExit(1)
    except SystemExit:
        raise
    except Exception as e:
        log.error(f"{type(e).__name__}: {e}")
        ctx.notify.error(TITLE, url, f"Critical error: {e}", node)
        raise SystemExit(1)
```

## Override, wrap, disable {#override}

A proprietary file at the same relative path as a commons action shadows it completely. Inside the shadowing module, `ctx.commons.run(args)` invokes the shadowed implementation — the wrap pattern:

```python {filename="proprietaries/actions/sync/packages.py"}
from engine.descriptor import Meta, Arg

METADATA = Meta(summary="sync/packages with a node-local pre-step.",
                args=[Arg("telegram_bot_url", "Telegram Bot URL")])

def run(ctx, args):
    ctx.log.info("Node-local preparation...")
    return ctx.commons.run(args)          # delegate to the commons implementation
```

To retire an action on one node, assign `DISABLED = "reason"` at module top level: dispatch refuses it (exit `1`) and the listing shows `[DISABLED: reason]`.

## Testing {#testing}

The commons test suite is stdlib `unittest`:

```bash
./tests/run.sh          # python3 -m unittest discover -s tests -p 'test_*.py' -v
```

Engine changes must keep the suite green. A cheap smoke gate for any action — commons or proprietary — is its parser: `apex <name> --help` must exit `0`, which proves the module parses, its `METADATA` is well-formed, and discovery sees it.

The commons pre-commit hook (wired by `init.sh` via `core.hooksPath`) runs `apex utils/lint-docker-compose --hook` against staged compose files, so composition changes are linted at commit time.

---

**See also:**

- [Concept: Actions and the overlay](/apex/concepts/actions-and-overlay)
- [Concept: The execution context](/apex/concepts/execution-context)
- [Reference: Engine API](/apex/reference/engine-api)
