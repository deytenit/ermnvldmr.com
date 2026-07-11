---
title: Engine API reference
description: The descriptor and ctx APIs available to action authors.
weight: 34
---

The surface an [action](/apex/glossary#action) author programs against: the argument descriptors in `engine.descriptor` and the members of the execution context. Conceptual background in [Concept: The execution context](/apex/concepts/execution-context).

## Descriptors {#descriptors}

```python
from engine.descriptor import Meta, Arg, Opt, Flag, Rest
```

| Class | Signature | argparse mapping |
|---|---|---|
| `Meta` | `Meta(summary, args=[])` | Drives both the listing summary and the parser. |
| `Arg` | `Arg(name, help="", required=True)` | Positional; `required=False` → `nargs="?"`, default `None`. |
| `Opt` | `Opt(name, help="", default=None)` | Value option (`--name VALUE`) with a default. |
| `Flag` | `Flag(name, help="")` | Boolean `store_true` flag. |
| `Rest` | `Rest(name, help="")` | Greedy remainder (`argparse.REMAINDER`). |

Usage errors exit `64` instead of argparse's default `2`.

> [!WARNING]
> `Rest` captures *everything* after the first positional — including flags. A `Flag` declared next to a `Rest` is only recognized *before* the positional; an action that must accept its flag anywhere has to strip it out of the remainder itself (the `compose` action does exactly this for `--dry-run`).

## ctx.log {#log}

`info(msg)` · `warn(msg)` · `success(msg)` → stdout; `error(msg)` → stderr. All lines carry the `[<node>] [<action>] [LEVEL]` prefix.

## ctx.sys {#sys}

| Method | Behavior |
|---|---|
| `run(cmd, check=True, capture=False, cwd=None, env=None, input=None)` | `subprocess.run` wrapper returning `CompletedProcess`; `capture=True` collects text stdout/stderr. |
| `sudo(cmd, **kw)` | `run(["sudo", *cmd])`. |
| `ok(cmd, **kw)` | `True` iff exit `0`; never raises. |
| `service_exists(name)` / `service_is_active(name)` / `service_is_enabled(name)` | systemd unit queries. |
| `start_and_enable(name)` | Start + enable when needed; returns final active state. |
| `ensure_running(name)` | `enable --now` when inactive. |
| `restart(name)` / `reload(name, dry_run=False)` / `daemon_reload()` | Service lifecycle. |
| `wait_for(name, timeout=30, interval=2)` | Poll until active. |
| `install_packages(packages)` | For each package: skip when its binary is on `PATH`, else `apt-get update -y` + `apt-get install -y`. |

## ctx.tpl {#tpl}

| Method | Behavior |
|---|---|
| `render(path, vars)` | Render one file (relative paths resolve against `configs/`); `safe_substitute` semantics — unknown variables stay literal. |
| `render_dir(rel_dir, vars)` | Render every file under a `configs/` subtree; returns `{relative_path: content}`. |

## ctx.host {#host}

| Method | Behavior |
|---|---|
| `backup(path, sudo=False)` | Copy the file to `<path>.<epoch>.bak`; returns the backup path or `None`. |
| `write_file(path, content, backup=True, dry_run=False, sudo=False)` | Atomic install via temp file (mode `0644`); optional prior backup; `sudo` variant preserves an existing target's mode. |
| `inject_block(target, content, start, end, anchor=None, old_pairs=(), dry_run=False, sudo=True)` | Managed marker-block replacement; removes current and legacy blocks, inserts after the first anchor line; `False` when the anchor is missing; missing target is an error. |
| `install_crontab(text, dry_run=False)` | Snapshot, refuse empty render (`SystemExit(65)`), preview, install via `crontab -`, restore snapshot on failure (`SystemExit(1)`). |

## ctx.ufw {#ufw}

`apply(rules_dir, config_dir=None, dry_run=False)` — the full firewall pass: directory guards (exit `66`), tool guards (`ufw`, `ufw-docker`), host rules, managed-block injection into `/etc/ufw/before.rules` and `after.rules`, container rules from `*.rules` files.

## ctx.crowdsec {#crowdsec}

`ensure_installed()` · `deploy(configs_subdir, vars, dry_run=False)` · `install_collections(collections)`.

## ctx.systemd {#systemd}

`deploy_units(configs_subdir, vars, dry_run=False)` — render the subtree's top-level non-hidden files into `/etc/systemd/system/`, then daemon-reload and `enable --now` each `.service`.

## ctx.notify {#notify}

`telegram(title, bot_url, message, node=None, level="INFO")` plus the shorthands `success` / `error` / `info` / `warn`. All return `bool` — `True` only when the message was delivered; an empty `bot_url` logs a warning and returns `False`. The alert `instance` defaults to the node's public host (`APEX_NODE_HOST`) — no domain or node prefix is applied.

## ctx.paths and ctx.node {#paths}

`ctx.paths`: `repo_root`, `commons`, `proprietaries`, `configs`, `compositions`, `core`, `tier1..3`, `stier1..3`, `root_tier1..3`. `ctx.node`: the identity record (`name`, `subnet`, `fqdn`, `host`) or `None` in a standalone commons checkout. `ctx.vars()`: the template/compose environment (see [Reference: Environment variables](/apex/reference/environment)). `ctx.commons.run(args)`: delegate to the shadowed commons action — only valid in an overriding proprietary module.

---

**See also:**

- [Concept: The execution context](/apex/concepts/execution-context)
- [Guide: Develop actions](/apex/guides/action-development)
- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
