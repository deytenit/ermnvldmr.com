---
title: Composition replication
description: Patterns, ownership, and acceptance requirements for replicated applications.
weight: 28
---

Replication belongs to an application deployment across independently owned node
repositories. It does not clone a node or turn unrelated compositions into a
cluster. Each node pins commons, owns its secrets and storage, and runs APEX
commands locally.

This contract describes design requirements. It does not certify a deployment's
availability or provide a shared failover daemon, readiness adapter, or promotion
command. Those implementations and their evidence belong to the participating
applications and node repositories.

## Choose a pattern

| Pattern | Responsibility |
|---|---|
| Stateless copies | Deploy compatible configuration and route only to ready instances. |
| Replicated backends | Use application-supported shared state; each backend owns its consistency and recovery. |
| Application-native cluster | Follow the application's membership, replication, election, and recovery procedures. |
| Active instance with standby | Transfer state consistently and fence the previous writer before promotion. |
| Recovery-only deployment | Restore a verified backup and activate explicitly when live replication is not validated. |

A composition may combine patterns. Duplicate web instances do not imply that
duplicate schedulers or workers are safe. Do not copy live database directories
as a generic replication method. Backups remain necessary for corruption,
accidental deletion, and total group loss.

## Record the deployment contract

Keep the following non-secret information beside each participating composition:

- Group identity, members, failure domains, desired roles, and compatible versions.
- Every mutable state store, its write authority, replication method, and recovery procedure.
- Dependencies, private endpoints, required ports, and credentials referenced by location.
- Shared versus node-specific configuration and the order of coordinated updates.
- Readiness, ingress withdrawal, joining, draining, promotion, rejoining, and full-outage recovery.
- Recovery-time targets, possible acknowledged-data loss, and session or revocation behavior.

Distinct hostnames do not prove independent failure domains. Two application
instances depending on one unreplicated backend do not survive loss of that
backend. Secrets that must match across replicas stay outside Git; node-specific
credentials remain distinct.

## Network and lifecycle requirements

Validate the actual protocols over the existing private transport, including
peer identity, reconnects, port restrictions, and container-network replacement.
Node-local Docker names and bridge addresses do not provide cross-host discovery.
Do not introduce another network overlay as a side effect of replication setup.

Container health alone is insufficient: readiness must reflect required
dependencies and write authority. Traffic routing must not promote a database
or send application writes to an unpromoted standby. Multiple ingress paths to
one backend provide ingress redundancy, not backend replication.

Initial creation, joining, and ordinary restart are separate operations. An
ordinary restart must not replay a seed, create a replacement cluster, discard
existing data, or promote a replica. A returning former primary stays fenced
until reconciled or reseeded and accepted as a replica. Image rollback does not
automatically reverse schema changes.

## Controlled SSO promotion

The selected Daedalus–Metis pattern is active/standby with native asynchronous
database and session replication over existing Xray transport. Icarus is not a
member of this application group. No automatic promotion controller or election
service is implied by this pattern.

Before promotion, positively fence the previous writer. An unreachable SSH or
tunnel endpoint is not proof of fencing. Record replication positions, possible
lost changes, and the explicit native role changes. Preserve enrolled directory
data, account identifiers, groups, and application encryption secrets.

Recent account changes, sessions, or revocations can be lost with asynchronous
replication. Verify login, session reset, and stale-session rejection after
promotion; resetting application sessions does not revoke every downstream
token. Measure operator-driven recovery time rather than promising automatic
failover or zero data loss. Node-specific runbooks own the executable procedure.

## Acceptance evidence

For each claimed guarantee, exercise relevant process failures, loss of each
location, network partitions, stale members, rejoining, and rolling updates.
Observe end-user operations and dependency state. Record recovery time, lost
acknowledged data, conflicting writers, session behavior, and manual intervention.
Test full-group restoration separately.

Standalone host enrollment through `ci/scripts/init-node.py` ends before
application data migration or replication-group creation. It does not authorize
formatting disks or promoting writers during a composition operation.
