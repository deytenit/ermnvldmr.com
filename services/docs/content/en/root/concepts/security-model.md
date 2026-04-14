---
title: Security & privilege isolation
description: Security measures, privilege isolation, and project-level sandboxing.
weight: 20
---

Security in Root is achieved through strict privilege isolation and project-level "sandboxing" to mitigate the impact of service compromises.

## The "No-Root" Principle {#noroot}

Running applications as `root` inside containers is a significant security risk. The framework enforces isolation via the `tiers/useradd` and `tiers/chown` actions.

### Project-specific users

Every project located at `{repository root}/{node}/{project}` is assigned a dedicated system user on the host. 

- **Isolation**: If a container is compromised, the attacker only gains the privileges of that specific low-privileged user.
- **Filesystem safety**: Projects can only read/write to their own directories within the [Tiers](/root/glossary#tier).

## Docker socket protection {#socket-protection}

Direct access to `/var/run/docker.sock` is equivalent to root access on the host. As a best practice, it is highly recommended to protect the Docker socket. One way to achieve this is by utilizing a **Socket Proxy** (e.g., based on `tecnativa/docker-socket-proxy`) to filter and restrict access to the Docker API.

```yaml filename="docker-socket-proxy-example.yml"
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
    # ...
    depends_on:
      - socket-proxy
    command:
      # Use the proxy instead of the local socket
      - "--providers.docker.endpoint=tcp://root-socket-proxy:2375"
    networks:
      socket: {}
```

## Security Monitoring (CrowdSec) {#crowdsec}

The framework integrates **CrowdSec** for behavioral detection and automated response.

- **Intrusion detection**: CrowdSec monitors logs from [Traefik](https://traefik.io/) and SSH for suspicious patterns (e.g., brute-force attacks, port scanning).
- **Automated blocking**: When a threat is detected, the **CrowdSec Firewall Bouncer** automatically updates [UFW](https://help.ubuntu.com/community/UFW) rules to block the malicious IP at the host level.
- **Shared threat intelligence**: CrowdSec shares anonymized threat data with its community, providing preemptive protection against known bad actors.

## Network hardening {#networking}

Root uses `configure/ufw` to implement a "Default Deny" policy.

- **Internal routing**: Services communicate over a dedicated `root-proxy` bridge network, which is often configured as `internal: true`.
- **Enclave isolation**: Outgoing traffic can be routed through a dedicated egress node for granular control.

---

**See also:**

- [Concept: Tiered storage](/root/concepts/tiered-storage)
- [Guide: Action development](/root/guides/action-development)
