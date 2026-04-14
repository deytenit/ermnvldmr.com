---
title: Synchronization Actions
description: Repository updates, package synchronization, and data backups.
weight: 54
---

Synchronization actions ensure that the host's state remains consistent with the defined configurations in the remote repositories.

## Core Synchronization Actions {#actions}

| Action | Description |
| :--- | :--- |
| `sync/packages` | Synchronizes node packages and their configurations across the system. |
| `sync/repository` | Updates the main configuration repository to its latest state from GitHub. |
| `sync/tiers` | Triggers the node-specific backup strategy for the configured [Tiers](/root/glossary#tier). |

## Repository Synchronization (`sync/repository`) {#repository}

The `sync/repository` action is responsible for keeping the host's configuration repository up-to-date with its remote source. It typically performs a `git pull` on the main configuration repository and may optionally trigger sub-module updates for the [Commons](/root/glossary#commons) repository.

This ensures that any changes to the node configurations, actions, or source files are correctly pulled down to the target host.

## Backup Synchronization (`sync/tiers`) {#tiers}

The `sync/tiers` action is the primary entry point for a node's backup strategy.

- **No Default Implementation**: The framework itself does not provide a default backup mechanism, allowing operators to design a custom strategy suitable for their needs.
- **Custom Overrides**: As a "Smart Dispatcher" action, you can define your backup logic by placing a custom script in `.operator/local/scripts/actions/sync/tiers`.
- **Example Implementation**: A common practice is to use a tool like [Restic](https://restic.net/) within this custom script to perform off-site backups of critical data (Tiers 1 and 2) to an S3-compatible storage backend.

---

**See also:**

- [Concept: Tiered Storage Model](/root/concepts/tiered-storage)
- [Reference: ROOT_ API Reference](/root/reference/root-api)
