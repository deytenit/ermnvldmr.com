---
title: ROOT_ API reference
description: Standardized environment variables for path resolution and node context.
weight: 50
---

Every [Action](/root/glossary#action) script executed via the `root` dispatcher has access to a standardized set of environment variables. These variables are the single source of truth for path resolution and node context.

## Path resolution variables {#paths}

These variables define the physical location of the infrastructure components.

| Variable | Description |
| :--- | :--- |
| `ROOT_SHARED` | Absolute path to the [Commons](/root/glossary#commons) repository. |
| `ROOT_CONFIGS` | Absolute path to the main configuration repository. |
| `ROOT_LOCAL` | Absolute path to the local operator directory (`.operator/local`). |
| `ROOT_ACTIONS_SHARED` | Path to the global shared actions. |
| `ROOT_ACTIONS_LOCAL` | Path to node-specific local actions. |

## Node context variables {#node-context}

When an action targets a specific [Node](/root/glossary#node), the following variables are established by the `root_require_node` helper.

| Variable | Description |
| :--- | :--- |
| `ROOT_NODE` | The identifier of the target node (e.g., `icarus`). |
| `ROOT_NODE_DIR` | Absolute path to the node configuration directory. |
| `ROOT_TIER1` | Absolute path to the [Tier 1](/root/glossary#tier) storage directory. |
| `ROOT_TIER2` | Absolute path to the Tier 2 storage directory. |
| `ROOT_TIER3` | Absolute path to the Tier 3 storage directory. |

## Logging helpers {#logging}

Standardized logging uses the `[$ROOT_NODE] [$ROOT_ACTION_PATH]` prefix for consistency across the orchestration logs.

- `root_log_info`: Standard informational output.
- `root_log_warn`: Warnings requiring attention but not stopping execution.
- `root_log_error`: Critical errors sent to `stderr`.
- `root_log_success`: Confirmation of successful task completion.

## Help system metadata {#help}

The `root` [Dispatcher](/root/glossary#dispatcher) provides a built-in `--help` system. To keep action scripts "stupid", they do not implement their own help flags. Instead, the dispatcher parses a specific `action_metadata` block defined at the top of every action script.

When a user runs `root <action> --help`, the dispatcher extracts and displays this YAML-formatted block without executing the script.

### Example metadata

```bash filename="example-action-metadata"
action_metadata() {
  cat <<EOF
description: "Brief summary of the task."
args:
  - NODE: "The node name"
  - PARAM: "A custom parameter"
EOF
}
```

---

**See also:**

- [Concept: Infrastructure principles](/root/concepts/principles)
- [Guide: Action development](/root/guides/action-development)
