---
title: System Initialization
description: Repository setup, Git hooks, and PATH configuration.
weight: 51
---

The Root framework requires a one-time initialization on each host to establish path linkages and repository-level configurations.

## The `init.sh` Script {#init-script}

The `init.sh` script located at the repository root is the primary bootstrap mechanism. It performs the following critical tasks:

1. **Submodule Initialization**: Ensures the [Commons](/root/glossary#commons) repository is present and up to date.
2. **Git Hook Configuration**: Points `core.hooksPath` to `.operator/shared/githooks` to enable standardized pre-commit checks.
3. **Safe Directory Registration**: Adds the repository to Git's `safe.directory` list, which is required for operations performed by different users (e.g., `root`, `adam`).
4. **Vim Configuration**: Links a standardized `.vimrc` to both the current user and the `root` user for a consistent editing experience.
5. **PATH Persistence**: Adds the `.operator/shared/scripts/run` directory to the user's `~/.bashrc`, making the `root` command available globally.

## Git Hooks {#githooks}

Root enforces standards through Git hooks stored in `.operator/shared/githooks/`.

- **Pre-commit**: Validates that all scripts follow the namespacing and structure conventions.
- **Commit-msg**: (Optional) Enforces conventional commit messages if configured.

## PATH Configuration {#path}

The `root` command is a wrapper located in `.operator/shared/scripts/run/root`. By adding this directory to the `PATH`, the dispatcher can be invoked from any directory within the system, automatically resolving the repository root based on the current working directory or environment variables.

```bash
# Example of manual PATH addition (performed automatically by init.sh)
export PATH="$HOME/repo/.operator/shared/scripts/run:$PATH"
```

---

**See also:**

- [Guide: Initial Host Setup](/root/guides/installation)
- [Reference: ROOT_ API Reference](/root/reference/root-api)
