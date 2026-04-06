---
title: Tiered storage model
description: Standardized storage taxonomy for service data.
weight: 15
---

The framework enforces a standardized storage taxonomy. This ensures that every service has a predictable location for its data, which simplifies backup strategies and hardware allocation.

## The storage taxonomy {#taxonomy}

Data is divided into three logical [Tiers](/root/glossary#tier) based on its lifecycle, volume, and importance.

### Tier 1: Configuration & critical state

**Path:** `${ROOT_NODE_DIR}/@tier1`

- **Contents**: Config files, small SQLite databases, SSL certificates.
- **Characteristics**: Extremely high value, low volume.
- **Backup strategy**: Frequent (hourly/daily), long retention.

### Tier 2: Application data

**Path:** `${ROOT_NODE_DIR}/@tier2`

- **Contents**: User uploads, large databases, persistent application state.
- **Characteristics**: High value, medium to high volume.
- **Backup strategy**: Daily, prioritized for integrity.

### Tier 3: Transients & bulk media

**Path:** `${ROOT_NODE_DIR}/@tier3`

- **Contents**: Logs, caches, temporary files, bulk media downloads.
- **Characteristics**: Low value, high volume.
- **Backup strategy**: Minimal or none. These directories are typically excluded from sync operations.

## Justification {#justification}

1. **Backup efficiency**: By separating logs (Tier 3) from configs (Tier 1), we avoid wasting storage space on redundant backups of transient data.
2. **Hardware optimization**: Tier 1 and 2 can be placed on fast SSD storage, while Tier 3 can be mounted on slower, high-capacity HDDs.
3. **Instant understanding**: Any operator can enter a [Node](/root/glossary#node) directory and immediately know where the critical data resides.

---

**See also:**

- [Concept: Infrastructure architecture](/root/concepts/architecture)
- [Reference: ROOT_ API](/root/reference/root-api)
