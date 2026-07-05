---
title: Glossary
description: Terminology used within the apex fleet operations framework.
weight: 100
---

Terminology used within the apex fleet operations framework.

## Action {#action}

**Action** - An atomic automation task: one Python module exposing `METADATA = Meta(...)` and `run(ctx, args)`, dispatched by its file path as `apex <group>/<action>`.

## Anchor IP {#anchor-ip}

**Anchor IP** - The static `ipv4_address` a project's main container holds on the `direct` network. Anchors make service addresses predictable and are validated by the compose lint.

## Capture-up {#capture-up}

**Capture-up** - The flow that records a host's live state back into its repository: a scheduled commit to the `sync/<node>` branch, rebased onto `main` and folded back by CI. Drift becomes a diff instead of divergence.

## Cluster {#cluster}

**Cluster** - A named group of nodes, `a1`, `a2`, and so on. The cluster appears in every node FQDN and owns an aligned /20 block of the enclave address space.

## Commons {#commons}

**Commons** - The shared repository (`apex.ermnvldmr.com`) holding the engine, the shared actions, and the core composition. Every node consumes it as the pinned `commons/` git submodule.

## Compositions {#compositions}

**Compositions** - The node-repository pillar declaring the node's runtime: one docker-compose project per service plus the core wrapper and the addressing ledger.

## Configs {#configs}

**Configs** - The node-repository pillar holding host configuration sources (`ufw/`, `cron/`, `systemd/`, `crowdsec/`), rendered through the template layer by the `configure/*` actions.

## Core composition {#core-composition}

**Core composition** - The shared, `${APEX_*}`-parameterized docker-compose project defining the fleet's common services (edge proxy, socket proxy, and the opt-in profile services). Defined once in the commons, included per node.

## Enclave {#enclave}

**Enclave** - The fleet's private address space, `198.18.0.0/16`, and by extension the internal reverse-proxy backend network named `enclave` in the core composition.

## Engine {#engine}

**Engine** - The stdlib-Python runtime under `commons/engine/`: the launcher, identity resolution, the overlay, the execution context, and the `ctx.*` helper library.

## Node {#node}

**Node** - A host managed by the framework, defined by exactly one node repository and identified by its FQDN `<node>.a<x>.apex.ermnvldmr.com`.

## Node identity {#node-identity}

**Node identity** - The resolved record of who a node is — name, cluster, subnet, FQDN — derived from the host FQDN and `node.env`.

## Overlay {#overlay}

**Overlay** - The resolution rule that lets a node's proprietaries add, override, wrap, or disable commons actions: `proprietaries/actions/` is consulted before `commons/actions/`.

## Proprietaries {#proprietaries}

**Proprietaries** - The node-repository pillar for node-local code: actions, libraries, and tool sources that apply to exactly one node and therefore do not belong in the commons.

## Tier {#tier}

**Tier** - One of the three standardized storage classes a node mounts (configuration, valuable data, reproducible data), reached from compositions through the `@tierN` symlink structure.

---

**See also:**

- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
