---
title: Troubleshooting
description: Symptoms, diagnosis, and fixes for common apex failure modes.
weight: 40
---

Failure modes the [engine](/apex/glossary#engine) reports, with the exact log lines it emits.

## APEX_NODE_FQDN falls back to the hostname {#fqdn-fallback}

**Symptoms:** every action logs `APEX_NODE_FQDN not set in node.env; using hostname '<fqdn>'.`

**Diagnosis:** `node.env` does not set `APEX_NODE_FQDN`, so the engine derived the FQDN from the OS hostname. On a node whose hostname is the intended FQDN this is harmless; otherwise traefik `Host()` routing will use the wrong name.

**Solution:** set `APEX_NODE_FQDN` explicitly in `node.env` at the repository root (for example `APEX_NODE_FQDN=node1.example.com`).

## Identity exits 66 {#identity-66}

**Symptoms:** `identity: APEX_NODE_FQDN missing from node.env and no hostname` or `identity: APEX_SUBNET missing from node.env`, exit `66`.

**Diagnosis:** a required identity field cannot be resolved. The first line means neither `APEX_NODE_FQDN` nor an OS hostname yields an FQDN; the second means `APEX_SUBNET` is absent. The engine refuses to guess.

**Solution:** create or complete `node.env` at the repository root — set `APEX_SUBNET`, and set `APEX_NODE_FQDN` (or ensure the OS hostname is usable).

## configure/ufw exits 66 {#ufw-66}

**Symptoms:** `Rules directory does not exist: ...` or `Config directory does not exist: ...`, exit `66`.

**Diagnosis:** exactly one of `configs/ufw/docker/` or `configs/ufw/host/` is missing — a broken config layout rather than an intentionally rule-less node.

**Solution:** restore the missing directory (empty is acceptable: an empty `docker/` warns `No .rules files found ... nothing to apply.` and continues).

## ufw tooling missing {#ufw-tools}

**Symptoms:** `ufw not installed/working via sudo. Run configure/base first.` or `ufw-docker not found at ~/.local/bin/ufw-docker. Run configure/base first.`, exit `1`.

**Diagnosis:** the firewall layer's prerequisites are absent.

**Solution:** run `apex configure/base`, then retry `apex configure/ufw`.

## Crontab install refused or rolled back {#cron}

**Symptoms:** `Rendered crontab is empty; aborting (previous kept).` (exit `65`) or `crontab install failed; restoring previous.` (exit `1`).

**Diagnosis:** the rendered `configs/cron/crontab` was empty (template/variable problem — remember unknown `$VARS` stay literal, they do not blank the file) or `crontab` rejected the syntax.

**Solution:** inspect the printed preview, fix the template, re-run `apex configure/cron`. The previous crontab is intact in both cases.

## sync/repository aborts {#sync-aborts}

**Symptoms:** `Commons submodule at <path> has uncommitted changes. Aborting.` or `Directory '<repo>/compositions' does not exist. Cannot sync.`, exit `1`.

**Diagnosis:** the [capture-up](/apex/glossary#capture-up) commit refuses to record a broken checkout — a dirty pinned submodule or a missing [compositions](/apex/glossary#compositions) tree.

**Solution:** for a dirty submodule, `git -C commons checkout -- .` (or commit an intentional pin move); for a missing tree, restore the checkout before the next scheduled run.

## Telegram not delivered {#telegram}

**Symptoms:** `Telegram Bot URL not provided. Skipping notification.` or `Failed to send Telegram notification: <error>` — and notify-gated actions (`backup/run`, `sync/repository`, `sync/packages`) exit `1` even though their work succeeded.

**Diagnosis:** the bot URL argument was empty, or the send failed (network, proxy, revoked token). The non-zero exit is deliberate: an unattended run whose status cannot be reported is treated as failed.

**Solution:** verify the URL source file the cron line reads, network/proxy reachability, and the bot token; re-run manually to confirm delivery.

## docker compose rejects the core wrapper {#compose-include}

**Symptoms:** `docker compose` errors on the `include` keyword when evaluating `compositions/apex/docker-compose.yml`.

**Diagnosis:** the [core composition](/apex/glossary#core-composition) is consumed through `include:`, which requires Docker Compose v2.20+.

**Solution:** upgrade the Compose plugin (`docker compose version` to verify).

---

**See also:**

- [Reference: CLI](/apex/reference/cli)
- [Guide: Operate a node](/apex/guides/host-operations)
- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
