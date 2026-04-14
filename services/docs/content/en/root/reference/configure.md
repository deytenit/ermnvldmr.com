---
title: Configuration Actions
description: Host provisioning, template engine, and system-level configuration.
weight: 53
---

Configuration actions are used to provision the host and maintain system-level services. They rely heavily on the built-in template engine to generate declarative configuration files.

## The Template Engine {#template-engine}

The Root framework uses `envsubst` (from `gettext-base`) to render templates. This allows you to use standard Bash environment variables directly within your configuration files.

### Template Conventions

- **File Extension**: Templates typically use the `.template` extension (e.g., `crontab.template`).
- **Variable Syntax**: Use `${VARIABLE_NAME}` or `$VARIABLE_NAME` to inject values.
- **Auto-Discovery**: Many actions automatically look for templates in specific directories within the [Configs](/root/glossary#configs) repository.

### Rendering Helpers

The `root_template.sh` library provides several helpers:

- `root_template_render <input> <output>`: Renders a single file.
- `root_template_render_directory <src> <dest>`: Recursively renders an entire directory structure.
- `root_template_crontab <template>`: Renders and installs a crontab for the current user.

## Core Configuration Actions {#actions}

| Action | Description |
| :--- | :--- |
| `configure/base` | Installs essential packages (`sudo`, `ufw`, `docker`) and sets up basic system users. |
| `configure/cron` | Renders and installs node-specific crontabs. |
| `configure/crowdsec` | Sets up the CrowdSec agent and bouncers. |
| `configure/routing` | Configures system-level routing and bridge networks. |
| `configure/systemd` | Installs and enables systemd service units. |
| `configure/ufw` | Renders and applies firewall rules using UFW and `ufw-docker`. |

## Example: Nginx Template {#example}

```nginx filename="nginx.conf.template"
# This template uses ROOT_NODE environment variable
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Injected from environment
    server_name ${ROOT_NODE}.example.com;
}
```

---

**See also:**

- [Concept: Infrastructure Architecture](/root/concepts/architecture)
- [Reference: ROOT_ API Reference](/root/reference/root-api)
