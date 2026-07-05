---
title: Operate a node
description: "Day-2 operations: configure, compose, backups, and repository sync."
weight: 24
---

**Context:** once bootstrapped, a [node](/apex/glossary#node) is operated entirely through the [engine](/apex/glossary#engine). This guide covers the recurring operations and what each actually does on the host.

## Host configuration {#configure}

`apex configure` runs the full configuration suite in a fixed order; each step is individually invocable when only one layer changed:

| Step | Effect |
|---|---|
| `configure/base` | Ensures a Debian base: package index update, essential packages (`curl`, `wget`, `git`, `rsyslog`), rsyslog running, `ufw` installed, and the `ufw-docker` helper at `~/.local/bin/ufw-docker`. |
| `configure/ufw` | Applies host rules, injects the managed kernel-rule blocks, applies container rules via `ufw-docker`. Supports `--dry-run`. |
| `configure/crowdsec` | Installs CrowdSec if absent, deploys `configs/crowdsec/` to `/etc/crowdsec/`, installs collections, and the firewall bouncer when configured. Supports `--dry-run`. |
| `configure/cron` | Renders `configs/cron/crontab` through the template layer and installs it — with preview, empty-render refusal (exit `65`), and rollback on a failed install. Supports `--dry-run`. |
| `configure/systemd` | Renders the top-level files of `configs/systemd/` into `/etc/systemd/system/`, then daemon-reloads and enables each `.service`. Supports `--dry-run`. |
| `configure/routing` | Enables IP forwarding and installs the fwmark policy-routing rule and table used by the enclave edge; idempotent. |

After `configure/ufw`, restart `ufw` deliberately (`sudo systemctl restart ufw`) — the action reminds you, and warns that the SSH port must already be allowed.

## Composition lifecycle {#compose}

```bash
apex compose up            # core first, then services alphabetically
apex compose down          # reverse order
apex compose restart
apex compose up --dry-run  # print the commands only
```

Extra arguments pass through to `docker compose` per project. Each project's `.env` and `apex.env` are supplied automatically when present.

## Backups {#backups}

```bash
apex backup/run "$(cat <path-to-telegram-url-file>)"
```

Init-if-needed, back up the tier-1 and tier-2 roots, apply retention, notify — the full flow is described in [Concept: Tiered storage](/apex/concepts/tiered-storage#backups). Schedule it from `configs/cron/crontab` so the run and its Telegram outcome are unattended.

## Repository sync (capture-up) {#sync}

```bash
apex sync/repository <telegram-bot-url>
```

Commits the live checkout to `sync/<node>`, rebases onto `origin/main`, and force-pushes with lease; CI folds the branch back into `main`. The action refuses to run — with a paged error — when the commons submodule is dirty or the `compositions/` tree is missing, and aborts cleanly on a rebase conflict (manual intervention required). See [Concept: Framework architecture](/apex/concepts/architecture#capture-up) for the model.

## Update awareness {#updates}

```bash
apex sync/packages <telegram-bot-url>
```

Reports pending apt upgrades and out-of-date container images (local digests compared against the registry via `skopeo`) in a single Telegram digest. It changes nothing on the host — it is a scheduled awareness check.

## Certificate extraction {#certs}

```bash
apex utils/extract-traefik-certs <acme.json> <dest-dir> [telegram-bot-url]
```

Dumps the edge proxy's ACME store into per-domain `fullchain.pem`/`privkey.pem` pairs (via a containerized dumper), restricts key permissions to `600`, and re-owns the output to the invoking user — for services that need raw PEM material instead of proxy-terminated TLS.

---

**See also:**

- [Getting started with an apex node](/apex/getting-started)
- [Reference: Actions](/apex/reference/actions)
- [Docs: Troubleshooting](/apex/troubleshooting)
