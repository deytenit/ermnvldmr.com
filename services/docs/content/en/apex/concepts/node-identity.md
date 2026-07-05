---
title: "Node identity resolution"
description: "How a node learns who it is: host FQDN, node.env, and the fallback chain."
weight: 12
---

Every apex operation runs in the context of exactly one [node](/apex/glossary#node). The [engine](/apex/glossary#engine) derives that [node identity](/apex/glossary#node-identity) — node name, [cluster](/apex/glossary#cluster), and subnet — from two local sources: the host FQDN and the `node.env` file at the repository root. This resolution step succeeds the `root_require_node` mechanism of the bash "root" commons framework that apex replaces.

## Identity sources {#sources}

### The host FQDN

An apex-shaped FQDN encodes both the node and its cluster:

```text
<node>.a<x>.apex.ermnvldmr.com
```

- The **first label** is the node name.
- The **second label** is the cluster — the letter `a` followed by a number (for example, `a1`).

The FQDN is matched strictly against this shape. When it matches, it is the authoritative source for both the node name and the cluster.

### node.env

`node.env` is a plain `KEY=value` file (shell-sourceable) located at the repository root. When parsed, comments and blank lines are ignored, and surrounding single or double quotes around values are stripped.

Its role in identity resolution is asymmetric:

- It **owns** `APEX_SUBNET` — the subnet is never encoded in the FQDN, so `node.env` is its only source. By framework convention, this is the node's `/24` carved from its cluster's `/20` block of the [enclave](/apex/glossary#enclave) space `198.18.0.0/16` (see [Concept: Fleet addressing scheme](/apex/concepts/addressing)).
- It **mirrors** `APEX_CLUSTER` — a redundant copy of the cluster that the FQDN already carries, used for cross-checking and as a fallback.

```ini {filename="node.env"}
APEX_CLUSTER=a1
APEX_SUBNET=198.18.16.0/24
```

## Resolution order {#resolution}

{{% steps %}}

### Parse the FQDN

If the host FQDN matches `<node>.a<x>.apex.ermnvldmr.com`, the node name and cluster are taken from its labels.

### Reconcile the cluster

If `node.env` defines `APEX_CLUSTER` and it disagrees with the cluster parsed from the FQDN, **the hostname wins** and a cluster-drift warning is emitted. Resolution continues with the FQDN's cluster.

### Fall back when the FQDN is not apex-shaped

If the FQDN does not match the apex shape — the mid-bootstrap or workstation-checkout case — a warning is emitted and the engine derives identity from local files instead:

- The **node name** comes from the repository directory name, matched against the `<node>.apex.ermnvldmr.com` shape. If the directory name does not match either, it is used as-is.
- The **cluster** comes from `APEX_CLUSTER` in `node.env`.

### Read the subnet

Regardless of which path resolved the name and cluster, the subnet is always read from `APEX_SUBNET` in `node.env`.

{{% /steps %}}

The result is a `Node` record with four fields: `name`, `cluster`, `subnet`, and `fqdn` (the FQDN as observed, even in the fallback case).

## Warnings {#warnings}

Identity resolution emits exactly two warnings; both signal a recoverable inconsistency that should be fixed.

| Condition | Warning message |
|---|---|
| `APEX_CLUSTER` in `node.env` disagrees with the cluster in the FQDN | `cluster drift: hostname says '<cluster>', node.env says '<env-cluster>'; hostname wins.` |
| The host FQDN does not match the apex shape | `FQDN '<fqdn>' is not apex-shaped; falling back to repo dir + node.env.` |

## Failure modes {#failures}

Resolution refuses to guess. Two conditions are fatal, and both exit with code `66` — the engine's exit-code convention for missing input:

- **No cluster anywhere.** The FQDN is not apex-shaped *and* `node.env` has no `APEX_CLUSTER`. The engine writes `identity: no cluster in FQDN or node.env` to stderr and exits.
- **No subnet.** `APEX_SUBNET` is absent from `node.env` (including when the file itself is missing). The engine writes `identity: APEX_SUBNET missing from node.env` to stderr and exits.

> [!WARNING]
> A missing or unreadable `node.env` is tolerated only while the FQDN is apex-shaped — and even then, resolution still fails on the missing `APEX_SUBNET`. A valid `node.env` with `APEX_SUBNET` is required on every node.

---

**See also:**

- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
