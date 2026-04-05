---
title: Action development
description: Developing atomic automation tasks in the Root framework.
weight: 30
---

[Actions](/root/glossary#action) are atomic automation tasks. Following the "Stupid Action" philosophy, they must remain declarative and rely on the library for complex operations.

## Creating a new action {#create}

{{% steps %}}

### Step 1: Create the script file

Place your script in `scripts/actions/{group}/{name}`. Do not use file extensions.

### Step 2: Implement metadata

Every action must provide a description and argument list for the help system.

```bash filename="scripts/actions/utils/my-action"
action_metadata() {
  cat <<EOF
description: "Brief summary of the task."
args:
  - NODE: "The node name"
  - PARAM: "A custom parameter"
EOF
}
```

### Step 3: Initialize context

Use the `root_require_node` helper to establish the environment. This must be the first functional step in your script.

```bash filename="scripts/actions/utils/my-action"
root_require_node "${1:-}"
shift
```

### Step 4: Use namespaced helpers

Perform operations using the `root_*` library functions. Rely on `ROOT_` environment variables for all pathing.

```bash filename="scripts/actions/utils/my-action"
root_log_info "Processing node $ROOT_NODE"
root_sys_restart_service "my-service"
```

{{% /steps %}}

## Library namespaces {#libraries}

Actions have access to the following modules:

- `root_core_*`: Logging and Telegram notifications.
- `root_init_*`: Declarative service initialization and package management.
- `root_sys_*`: Systemd and unit file management.
- `root_template_*`: Envsubst-based rendering and configuration injection.
- `root_validate_*`: Input, file, and OS validation.

---

**See also:**

- [Reference: ROOT_ API reference](/root/reference/root-api)
- [Concept: Infrastructure architecture](/root/concepts/architecture)
