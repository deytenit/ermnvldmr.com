---
title: Glossary
description: Terminology used within the Root infrastructure framework.
weight: 100
---

Terminology used within the Root infrastructure framework.

## Action {#action}

**Action** - An atomic automation task located in `scripts/actions/`. Actions follow the "Stupid Action" philosophy, remaining declarative and relying on the `root` dispatcher for environment setup.

## Commons {#commons}

**Commons** - The shared repository containing generic logic, namespaced libraries, and standardized automation actions used across all nodes. Referenced at [GitHub: ermnvldmr.com-root-commons](https://github.com/deytenit/ermnvldmr.com-root-commons).

## Dispatcher {#dispatcher}

**Dispatcher** - The `root` script that serves as the entrypoint. It resolves paths, warms the environment, and executes the requested [Action](/root/glossary#action).

## Node {#node}

**Node** - A physical or virtual host managed by the framework. Each node has a dedicated directory in the configuration repository containing its services and local settings.

## Root {#root}

**Root** - Both the name of the command-line utility and the top-level orchestration service within a [Node](/root/glossary#node) (typically handling Traefik and Adguard).

## Tier {#tier}

**Tier** - A standardized storage classification for service data.
- **Tier 1**: Configuration and critical state.
- **Tier 2**: Application data and databases.
- **Tier 3**: Logs, caches, and bulk media.

---

**See also:**

- [Concept: Infrastructure architecture](/root/concepts/architecture)
- [Concept: Tiered storage model](/root/concepts/tiered-storage)
