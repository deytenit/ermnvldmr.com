---
title: Infrastructure principles
description: Core principles providing a secure, predictable, and minimal-dependency environment.
weight: 5
---

The Root framework is built on core principles designed to provide a secure, predictable, and minimal-dependency environment for independent self-hosted projects.

## Predictability through structure {#predictability}

Manual server configuration is prone to "configuration drift," where hosts intended to be identical slowly diverge. Root solves this by:

- **Git-centric truth**: Every configuration, from UFW rules to crontabs, is stored in the repository.
- **Idempotent automation**: [Actions](/root/glossary#action) are designed to be run multiple times without causing side effects, ensuring the host always matches the intended state.

## Minimal dependency footprint {#minimalism}

To ensure long-term maintainability, the framework avoids complex configuration management tools (like Ansible or Salt). Instead, it relies on:

- **Bash**: The universal language of Unix systems.
- **Docker**: For application isolation and environment consistency.
- **Standard Linux tools**: Leveraging `systemd`, `ufw`, and `cron` directly.

## Decentralization {#decentralization}

Each [Node](/root/glossary#node) is an island. While they share the [Commons](/root/glossary#commons) library, they do not depend on a central "master" server. This architecture ensures that a failure in one host does not impact unrelated services.

---

**See also:**

- [Concept: Security model](/root/concepts/security-model)
- [Concept: Tiered storage](/root/concepts/tiered-storage)
