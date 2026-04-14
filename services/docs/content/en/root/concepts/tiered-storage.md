---
title: Tiered storage model
description: Standardized storage taxonomy for service data.
weight: 15
---

The framework enforces a standardized storage taxonomy. This ensures that every service has a predictable location for its data, which simplifies backup strategies and hardware allocation.

## The storage taxonomy {#taxonomy}

Data is divided into three logical [Tiers](/root/glossary#tier) based on its performance requirements, lifecycle, and importance.

### Tier 1: Configuration & Cache

**Path:** `${ROOT_NODE_DIR}/@tier1`

- **Contents**: Config files, small SQLite databases, SSL certificates, application cache.
- **Characteristics**: Extremely high value, low to medium volume, requires low latency.
- **Hardware**: High-speed SSD storage, typically shared with the Operating System.

### Tier 2: Application Data

**Path:** `${ROOT_NODE_DIR}/@tier2`

- **Contents**: User uploads, large databases, persistent application state.
- **Characteristics**: High value, medium to high volume, requires high reliability.
- **Hardware**: Reliable HDD clusters, RAID arrays, or dedicated storage compute.

### Tier 3: Transients & Bulk Media

**Path:** `${ROOT_NODE_DIR}/@tier3`

- **Contents**: Logs, temporary files, bulk media (movies, music), and other non-critical large data.
- **Characteristics**: Low value, very high volume.
- **Hardware**: High-capacity HDDs optimized for continuous sequential write/read (e.g., WD Purple). Note that Tier 3 is **too slow for cache**.

## Backup strategy {#backup}

The framework does not enforce a specific backup strategy or provide a default implementation, allowing for complete node-specific flexibility. Operators are expected to implement their own backup logic.

### Example: Restic backup

A common best practice is to use **Restic** for backups. For example, you might create an operator compose file to run Restic:

```yaml filename="operator-compose.yml"
services:
  restic:
    image: restic/restic:0.18.1
    container_name: operator-restic
    volumes:
      - ./@tier2/{project}/{service}/{data}:/data/@tier2/{project}/{service}/{data}:ro
      - ./@tier1/{project}/{service}/{data}:/data/@tier1/{project}/{service}/{data}:ro
      - ./@tier1/.operator/restic/cache:/var/restic-cache
    environment:
      RESTIC_REPOSITORY: "s3:example.com/bucket"
      RESTIC_PASSWORD: ${RESTIC_PASSWORD}
      # ... AWS/S3 credentials
    network_mode: "host"
    entrypoint: [ "restic" ]
    user: "0:0"
```

### Implementing the strategy

Operators can implement this strategy by defining a local action in `.operator/local/scripts/actions/sync/tiers`. The `root` dispatcher can then execute this script to trigger the backup, allowing for granular control over how data is persisted.

## Justification {#justification}

1. **Hardware optimization**: By mapping tiers to specific hardware (SSDs for Tier 1, RAID for Tier 2, Purples for Tier 3), we optimize for both performance and cost.
2. **Selective backup**: Separating transient logs and bulk media (Tier 3) from critical configs (Tier 1) prevents wasting expensive backup storage.
3. **Architectural clarity**: Any operator can inspect a [Node](/root/glossary#node) directory and immediately understand the storage requirements and priority of its contents.

---

**See also:**

- [Concept: Infrastructure architecture](/root/concepts/architecture)
- [Reference: ROOT_ API](/root/reference/root-api)
