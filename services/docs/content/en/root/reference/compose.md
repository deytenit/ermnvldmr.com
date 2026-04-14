---
title: Compose Actions
description: Standardized high-level entrypoint for orchestrating docker-compose across a node.
weight: 54
---

The `compose` action provides a standardized, high-level entrypoint for orchestrating Docker Compose files across all projects within a specific node.

## Core Compose Action {#actions}

| Action | Description |
| :--- | :--- |
| `compose <node> <action>` | Executes a given Docker Compose command (e.g., `up`, `down`, `restart`) across the node's infrastructure. |

## Orchestration Order {#order}

To maintain correct dependencies (especially when shutting down or starting up infrastructure-level proxies and networks), the `compose` action intelligently orders the execution:

### Starting Up (`up`, `restart`)
When starting or restarting services, the action follows a **Forward Order**:
1. **Node Infrastructure**: First, it processes the node-level `docker-compose.yml` (located at the root of the node directory).
2. **Root Infrastructure**: Next, it processes the `root/docker-compose.yml` project, if it exists (usually contains Traefik, Socket Proxy, etc.).
3. **Projects**: Finally, it processes all other project directories in alphabetical order.

### Shutting Down (`down`)
When stopping services, the action uses a **Reverse Order** to ensure projects disconnect gracefully before the network or proxy goes down:
1. **Projects**: All standard projects are stopped in reverse alphabetical order.
2. **Root Infrastructure**: The `root/docker-compose.yml` project is stopped.
3. **Node Infrastructure**: Finally, the node-level `docker-compose.yml` is brought down.

## Options {#options}

You can pass standard Docker Compose arguments to the end of the command.
Additionally, the action supports a dry-run mode:

- `--dry-run`: Prints the commands that would be executed without actually running them.

**Example usage:**
```bash
root compose daedalus up -d --remove-orphans
root compose daedalus restart --dry-run
root compose daedalus down
```

---

**See also:**

- [Concept: Infrastructure Architecture](/root/concepts/architecture)
- [Reference: ROOT_ API Reference](/root/reference/root-api)
