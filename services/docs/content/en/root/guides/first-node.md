---
title: "Setting Up Your First Node"
description: A practical guide on creating your first node and hooking up the deployment commons.
weight: 25
---

**Goal:** Create a configuration repository for your infrastructure, add the root deployment commons as a submodule, and define your first basic node.

## 1. Creating the Configuration Repository

Your infrastructure should be managed from a single Git repository. This repository will hold the configuration for all your servers (nodes).

{{% steps %}}

### Step 1: Initialize the repository

Create a new directory and initialize Git.

```bash
mkdir my-infrastructure
cd my-infrastructure
git init
```

### Step 2: Add the commons submodule

The `ermnvldmr.com-root-commons` must be placed at `.operator/shared`.

```bash
mkdir -p .operator
git submodule add https://github.com/deytenit/ermnvldmr.com-root-commons.git .operator/shared
```

### Step 3: Create the Bootstrap Script

Create an `init.sh` file at the root of your repository. This script links the commons framework into your local environment.

```bash filename="init.sh"
#!/usr/bin/env bash
# init.sh

# Source common utilities from the submodule
source "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)/.operator/shared/scripts/lib/common.sh"

SCRIPT_NAME="init"

navigate_to_repo_root

log_info "Setting up Git hooks..."
git config core.hooksPath .operator/shared/githooks
git config --global --add safe.directory "${REPO_ROOT}"

log_info "Setting up PATH for the root dispatcher..."
ABSOLUTE_RUN_DIR="$(realpath "${REPO_ROOT}/.operator/shared/scripts/run")"
BASHRC_ENTRY="export PATH=\"${ABSOLUTE_RUN_DIR}:\$PATH\""

sed -i '/\.operator\/shared\/scripts\/run/d' ~/.bashrc
echo "$BASHRC_ENTRY" >> ~/.bashrc
log_info "Done. Please run 'source ~/.bashrc' or re-login to your shell."
```

Make it executable:
```bash
chmod +x init.sh
```

{{% /steps %}}

## 2. Defining Your First Node

A Node is a folder at the repository root that represents one physical or virtual server.

### Node Structure

Let's create a node named `daedalus`. Inside, we'll define an operator configuration (e.g., for backups) and a core service.

```bash
mkdir -p daedalus/.operator/configs/{cron,crowdsec,systemd,ufw/docker,ufw/host}
mkdir -p daedalus/root
```

### Base Configurations (Optional)

You can place configuration files (like UFW rules or a crontab) inside the `daedalus/.operator/configs/` directory. For example, a basic crontab:

```bash filename="daedalus/.operator/configs/cron/crontab.template"
# Run backups every night at 3:00 AM
0 3 * * * root sync tiers daedalus
```

## 3. Configuring Services (Docker Compose)

The framework relies on `docker-compose.yml` to orchestrate services.

### Node-Level Infrastructure (Operator)

The `daedalus/docker-compose.yml` file runs infrastructure utilities, such as `restic` for backups or VPN agents. This compose file has direct access to the filesystem via `@tierX` mounts.

```yaml filename="daedalus/docker-compose.yml"
name: 'operator'

services:
  restic:
    image: restic/restic:0.18.1
    container_name: operator-restic
    volumes:
      # Example: mounting project data for backups (Read-Only)
      - ./@tier2/my-app/data:/data/@tier2/my-app/data:ro
      - ./@tier3/.operator/restic/cache:/var/restic-cache
    environment:
      RESTIC_REPOSITORY: "s3:example.com/my-bucket/daedalus"
      RESTIC_PASSWORD: "${RESTIC_PASSWORD?error}"
      # AWS credentials...
    network_mode: "host"
    entrypoint: [ "restic" ]
```

### The Root Project

The `root` project typically contains your reverse proxies (Traefik) and core services that other projects will route through.

```yaml filename="daedalus/root/docker-compose.yml"
name: root

services:
  socket-proxy:
    image: tecnativa/docker-socket-proxy:0
    container_name: root-socket-proxy
    user: "0:0"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      CONTAINERS: 1
      SERVICES: 1
      TASKS: 1
    networks:
      socket: {}
    restart: unless-stopped

  traefik:
    image: traefik:3.6
    container_name: root-traefik
    # UID and GID are automatically populated by the framework after running 'root tiers useradd'
    user: "${UID?error}:${GID?error}"
    group_add:
      - "${SHARED_GID?error}"
    depends_on:
      - socket-proxy
    volumes:
      - ./@tier1/shared/root/traefik/letsencrypt:/letsencrypt
      - ./@tier3/traefik/logs:/logs
      - ./@tier1/traefik/dynamic:/etc/traefik/dynamic:ro
    ports:
      - '0.0.0.0:80:80'
      - '0.0.0.0:443:443'
    networks:
      proxy: {}
      socket: {}
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.network=root-proxy"
      - "--providers.docker.endpoint=tcp://root-socket-proxy:2375"
    restart: unless-stopped

networks:
  proxy:
    name: root-proxy
    internal: true
    driver: bridge
  socket:
    name: root-socket
    internal: true
    driver: bridge
```

## 4. Deployment

Now that your structure is ready:

1. Commit and push this repository to your Git server (e.g., GitHub).
2. SSH into your VPS.
3. Follow the [Installation](/root/guides/installation) guide, using your new repository URL instead of the example ones.

---

**See also:**

- [Guide: Installation on a new host](/root/guides/installation)
- [Concept: Infrastructure Architecture](/root/concepts/architecture)
