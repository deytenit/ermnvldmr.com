---
title: ROOT_ API reference
description: Standardized environment variables for path resolution and node context.
weight: 50
---

Every [Action](/root/glossary#action) script executed via the `root` dispatcher has access to a standardized set of environment variables and Bash libraries. This provides a consistent "API" for interacting with the infrastructure.

## The `root` Dispatcher {#dispatcher}

The `root` command (located in `.operator/shared/scripts/run/root`) is the main entrypoint for all orchestration. Its primary responsibilities include:

1. **Context Resolution**: Locating the target [Node](/root/glossary#node) and its associated storage [Tiers](/root/glossary#tier).
2. **Library Loading**: Sourcing the core namespaced libraries (e.g., `root_core`, `root_sys`).
3. **Action Execution**: Discovering and running the requested action, prioritizing local overrides.

## Path resolution variables {#paths}

These variables are established by the dispatcher and are available to all actions.

| Variable | Description |
| :--- | :--- |
| `ROOT_SHARED` | Absolute path to the [Commons](/root/glossary#commons) repository. |
| `ROOT_CONFIGS` | Absolute path to the main configuration repository. |
| `ROOT_LOCAL` | Absolute path to the local operator directory (`.operator/local`). |
| `ROOT_ACTIONS_SHARED` | Path to the global shared actions. |
| `ROOT_ACTIONS_LOCAL` | Path to node-specific local actions. |

## Node context variables {#node-context}

When an action targets a specific node, the following variables are established by the `root_require_node` helper.

| Variable | Description |
| :--- | :--- |
| `ROOT_NODE` | The identifier of the target node (e.g., `daedalus`). |
| `ROOT_NODE_DIR` | Absolute path to the node configuration directory. |
| `ROOT_TIER1` | Absolute path to the [Tier 1](/root/glossary#tier) storage directory. |
| `ROOT_TIER2` | Absolute path to the Tier 2 storage directory. |
| `ROOT_TIER3` | Absolute path to the Tier 3 storage directory. |

## Core Logging Helpers {#logging}

Standardized logging ensure consistent output across all actions.

- `root_log_info`: Standard informational output.
- `root_log_warn`: Warnings requiring attention.
- `root_log_error`: Critical errors sent to `stderr`.
- `root_log_success`: Confirmation of successful task completion.

## The Help System {#help}

The dispatcher provides a built-in help system by parsing an `action_metadata` block at the top of each script. This allows scripts to remain "stupid" and declarative without implementing their own CLI argument parsing.

```bash filename="example-action-metadata"
action_metadata() {
  cat <<EOF
description: "Brief summary of the action."
args:
  - NODE: "The name of the target node."
EOF
}
```

---

**See also:**

- [Concept: Infrastructure principles](/root/concepts/principles)
- [Guide: Action development](/root/guides/action-development)
