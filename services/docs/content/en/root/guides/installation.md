---
title: Installation
description: Initial setup of the Root framework on a new host.
weight: 25
---

This guide covers the initial setup of the Root framework on a new host.

## Prerequisites {#prerequisites}

- A Debian-based Linux distribution (Debian or Ubuntu).
- Git installed.
- Sudo privileges.

## Initializing the repository {#init}

{{% steps %}}

### Step 1: Clone the configuration repository

Clone the repository containing your [Node](/root/glossary#node) configurations.

```bash
git clone <your-configs-repo-url> ~/repo
cd ~/repo
```

### Step 2: Run the initialization script

The `init.sh` script sets up the [Commons](/root/glossary#commons) submodule, configures Git hooks, and adds the `root` wrapper to your `PATH`.

```bash
./init.sh
```

### Step 3: Refresh your shell

Source your `.bashrc` to activate the `root` command.

```bash
source ~/.bashrc
```

{{% /steps %}}

## Provisioning a node {#provision}

Once the framework is installed, you can provision a specific [Node](/root/glossary#node).

```bash
root configure/base <node_name>
root configure/ufw <node_name>
```

---

**See also:**

- [Concept: Infrastructure architecture](/root/concepts/architecture)
- [Reference: ROOT_ API reference](/root/reference/root-api)
