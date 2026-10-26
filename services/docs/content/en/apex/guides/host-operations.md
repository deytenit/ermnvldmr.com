---
title: Operate a node
description: "Day-2 operations: configure, compose, backups, and repository sync."
weight: 24
---

**Context:** once bootstrapped, a [node](/apex/glossary#node) is operated entirely through the [engine](/apex/glossary#engine). This guide covers the recurring operations and what each actually does on the host.

## Host configuration {#configure}

`apex configure` runs the full configuration suite in a fixed order; each step is individually invocable when only one layer changed:

| Step | Effect |
|---|---|
| `configure/base` | Installs missing Debian packages after checking that APT's simulation contains no upgrades or removals, ensures rsyslog is running, and verifies the pinned `/usr/local/bin/ufw-docker` before privileged execution. Avoid concurrent package operations. |
| `configure/timezone` | Applies `configs/timezone` when present and refreshes active cron after a timezone change. Supports `--dry-run`. |
| `configure/ufw` | Applies host rules, injects the managed kernel-rule blocks, applies container rules via `ufw-docker`. Supports `--dry-run`. |
| `configure/crowdsec` | Installs CrowdSec if absent, deploys `configs/crowdsec/` to `/etc/crowdsec/`, installs collections, and the firewall bouncer when configured. Supports `--dry-run`. |
| `configure/cron` | Renders `configs/cron/crontab` through the template layer and installs it — with preview, empty-render refusal (exit `65`), and rollback on a failed install. Supports `--dry-run`. |
| `configure/systemd` | Renders the top-level files of `configs/systemd/` into `/etc/systemd/system/`, then daemon-reloads and enables each `.service`. Supports `--dry-run`. |
| `configure/routing` | Enables IP forwarding and installs the fwmark policy-routing rule and table used by the enclave edge; idempotent. |

After `configure/ufw`, restart `ufw` deliberately (`sudo systemctl restart ufw`) — the action reminds you, and warns that the SSH port must already be allowed.

## Composition lifecycle {#compose}

```bash
apex compose up            # core first, then services alphabetically
apex compose down          # reverse order
apex compose restart
apex compose --dry-run up  # print the commands only
apex compose -p apex restart traefik
apex compose -p app up -d
```

Put wrapper options (`-p` and `--dry-run`) before the action. Extra arguments pass
through to Docker Compose for the selected project. Each project's `.env` and
`apex.env` are supplied automatically when present. Positional targeting remains
available as `apex compose restart apex traefik` or `apex compose up -d apex`;
prefer `-p` when arguments could also name a composition.

Replace `app` with a composition defined in your repository. When a mount or
other container definition changes, use targeted `up -d` to recreate it:
`restart` retains the existing definition.

### Direct core Compose commands

```bash
apex env --sync
cd compositions/apex
docker compose config --quiet
docker compose restart traefik
```

Sync preserves existing secret and UID/GID text in `.env` and its tier-storage
symlink. A managed block loads committed `apex.env` settings, including profiles,
then synthesized node/path values. Writes use mode `0600`. Resync after changing
those settings or paths; do not hand-edit the managed block. Docker's shell
environment still overrides file values.

`eval "$(apex env)"`, `apex env --dotenv`, and `apex env --write generated.env`
export or save generated APEX values only. They do not load composition secrets
or replace the full `--sync` bridge. Output modes are mutually exclusive.

## Backups {#backups}

```bash
apex backup/run "$(cat <path-to-telegram-url-file>)"
```

Runs [resticontainer](https://github.com/deytenit/resticontainer) one-shot under the `manual` compose profile: init-if-needed, then a label-driven backup that discovers each service's intent from its `restic.*` compose labels (`restic.enable`, `restic.backup.paths`, …), snapshots the union of the resolved host paths in a single restic run (`--host` = `APEX_NODE_HOST`, `--compression max`), applies retention (`forget --prune`), and notifies. It refuses to report success if no `restic.*`-labelled service produced a new snapshot. The full flow is described in [Concept: Tiered storage](/apex/concepts/tiered-storage#backups). Schedule it from `configs/cron/crontab` so the run and its Telegram outcome are unattended.

## Repository sync (capture-up) {#sync}

```bash
apex sync/repository <telegram-bot-url>
```

Commits the live checkout to `sync/<node>`, rebases onto `origin/main`, and force-pushes with lease. The action refuses to run — with a paged error — when the commons submodule is dirty or the `compositions/` tree is missing, and aborts cleanly on a rebase conflict (manual intervention required). See [Concept: Framework architecture](/apex/concepts/architecture#capture-up) for the model.

## Update awareness {#updates}

```bash
apex sync/packages <telegram-bot-url>
```

Reports pending apt upgrades and out-of-date container images (local digests compared against the registry via `skopeo`) in a single Telegram digest. It changes nothing on the host — it is a scheduled awareness check.

## Certificate extraction {#certs}

```bash
apex utils/extract-traefik-certs <acme.json> <dest-dir> [telegram-bot-url]
```

Dumps the edge proxy's ACME store into per-domain `fullchain.pem`/`privkey.pem` pairs (via a containerized dumper), restricts key permissions to `600`, and re-owns the output to the invoking user — for services that need raw PEM material instead of proxy-terminated TLS.

---

**See also:**

- [Getting started with an apex node](/apex/getting-started)
- [Reference: Actions](/apex/reference/actions)
- [Docs: Troubleshooting](/apex/troubleshooting)
