---
title: Tier Management Actions
description: Storage classification, symbolic linking, and privilege isolation.
weight: 55
---

Tier management actions are responsible for enforcing the framework's [Tiered Storage Model](/root/concepts/tiered-storage) and ensuring correct filesystem ownership and isolation.

## Core Tier Actions {#actions}

| Action | Description |
| :--- | :--- |
| `tiers/chown` | Sets correct filesystem ownership for project-specific [Non-Root Users](#useradd). |
| `tiers/link` | Manages symbolic links between the project directories and their corresponding [Tiers](/root/glossary#tier). |
| `tiers/useradd` | Provisions a unique system user for each project to achieve [Privilege Isolation](/root/concepts/security-model). |

## User Management (`tiers/useradd`) {#useradd}

The `tiers/useradd` action creates a dedicated, low-privileged system user for each project within a node. This user is then used to run the project's containers, ensuring that a compromise of one project does not grant the attacker access to the entire host.

- **Naming Convention**: Users are typically named after the project.
- **Group Membership**: Users can optionally be added to the `docker` group or interact with Docker via other securely configured methods, depending on the operator's preference.

## Storage Linking (`tiers/link`) {#link}

The `tiers/link` action creates the symbolic link structure required for the tiered storage model. It ensures that directories like `config`, `data`, and `logs` within a project folder point to their physical locations in `@tier1`, `@tier2`, and `@tier3` respectively.

```bash
# Example link structure created by tiers/link
/srv/root/icarus/synapse/config -> /srv/storage/@tier1/synapse
/srv/root/icarus/synapse/data   -> /srv/storage/@tier2/synapse
/srv/root/icarus/synapse/logs   -> /srv/storage/@tier3/synapse
```

## Ownership Management (`tiers/chown`) {#chown}

Once tiers and links are established, the `tiers/chown` action ensures that the physical directories in each tier are owned by the correct project user. This is critical for preventing permission-denied errors and ensuring that projects can only access their own data.

---

**See also:**

- [Concept: Tiered Storage Model](/root/concepts/tiered-storage)
- [Concept: Security & Privilege Isolation](/root/concepts/security-model)
