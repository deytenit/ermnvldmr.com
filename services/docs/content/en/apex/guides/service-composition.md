---
title: Add a service composition
description: "Wire a new project into a node: anchor IP, networks, tiers, and lint."
weight: 23
---

**Context:** a project joins a [node](/apex/glossary#node) as one directory under `compositions/` containing a hand-authored compose file. The framework's contract for that file is small: a static [anchor IP](/apex/glossary#anchor-ip) on the `direct` network, external network references by key, and tier-relative data paths.

{{% steps %}}

### Allocate the anchor address

Pick the next free address at `.20` or above in the node's /24 and record it in `compositions/ADDRESSING.md`. Addresses `.10`–`.19` are reserved for the [core composition](/apex/glossary#core-composition) (see [Concept: Fleet addressing scheme](/apex/concepts/addressing)).

### Author the compose file

```yaml {filename="compositions/<project>/docker-compose.yml"}
name: <project>
services:
  <anchor>:
    image: ...
    container_name: <project>-<anchor>
    user: "${APEX_UID?error}:${APEX_GID?error}"
    group_add:
      - "${APEX_SHARED_GID?error}"
    volumes:
      - ./@tier1/<anchor>/config:/config
      - ./@tier2/<anchor>/data:/data
    networks:
      direct:
        ipv4_address: 198.18.16.20
      enclave: {}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.<project>.rule=Host(`...`)"
      - "traefik.http.services.<project>.loadbalancer.server.port=8080"
    restart: unless-stopped

  <sidecar>:
    image: ...
    network_mode: "service:<anchor>"

networks:
  direct:
    external: true
  enclave:
    external: true
```

Conventions at work:

- **One anchor per project** holds the static `ipv4_address` on `direct`; sidecars share its network namespace via `network_mode: service:<anchor>`.
- **Networks are referenced by key** (`direct`, `enclave`, `socket`) with `external: true` — the core composition owns their definitions.
- **`enclave` membership plus traefik labels** publishes the service through the edge proxy; the proxy discovers it via the socket proxy, never via published ports.
- **Data paths are tier-relative** (`./@tierN/...`) and resolve through the symlinks created by `tiers/link`.
- The `${APEX_UID...}` trio comes from the project `.env` maintained by `tiers/useradd`.

### Provision storage and identity

```bash
apex tiers/link <tier1> <tier2> <tier3>
apex tiers/useradd
apex tiers/chown
```

Re-running the trio is idempotent; it picks up the new project, creates its tier directories and `.env`, provisions its `noroot-<project>` user, and applies the ownership matrix.

### Lint

```bash
apex utils/lint-docker-compose
```

Validates every anchor IP (well-formed, unique, inside the node subnet) and runs the compose linter over the repository. The pre-commit hook enforces the same lint on staged compose files.

### Deploy

```bash
apex compose up
```

The core composition is already up; the new project starts in its alphabetical slot. Verify with `docker ps` and, if the service is proxied, through its route on the edge.

{{% /steps %}}

## Notes

- Service-internal secrets (for example a database password) live in the project's own `.env` in tier-1 storage, alongside the auto-injected UID block.
- Never define `direct`/`enclave`/`socket` inside a project file — a second definition would race the core composition for network ownership.

---

**See also:**

- [Concept: Compositions and the shared core](/apex/concepts/compositions)
- [Concept: Tiered storage and privilege isolation](/apex/concepts/tiered-storage)
- [Concept: Fleet addressing scheme](/apex/concepts/addressing)
