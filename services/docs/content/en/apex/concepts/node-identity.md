---
title: "Node identity resolution"
description: "How a node learns who it is: node.env identity keys and the FQDN fallback."
weight: 12
---

Every apex operation runs in the context of exactly one [node](/apex/glossary#node). The [engine](/apex/glossary#engine) derives that [node identity](/apex/glossary#node-identity) — node name, subnet, FQDN, and public host — from the `node.env` file at the repository root, with the OS hostname as a fallback for the FQDN only. The framework assumes no domain and no clustering: a node declares who it is explicitly. This resolution step succeeds the `root_require_node` mechanism of the bash "root" commons framework that apex replaces.

## Identity sources {#sources}

### node.env

`node.env` is a plain `KEY=value` file (shell-sourceable) located at the repository root. When parsed, comments and blank lines are ignored, and surrounding single or double quotes around values are stripped.

It declares identity explicitly through these keys:

- `APEX_NODE_FQDN` — the node's real FQDN, used for traefik `Host()` routing. If unset, the engine falls back to the OS hostname (and warns).
- `APEX_NODE_HOST` — the node's public host name, used for the backup `--host` and the observability/notify `instance`. Defaults to `APEX_NODE_FQDN`.
- `APEX_SUBNET` — the node's `/24` for the `direct` network. **Required**; there is no other source for it (see [Concept: Fleet addressing scheme](/apex/concepts/addressing)).

```ini {filename="node.env"}
APEX_NODE_FQDN=node1.example.com
APEX_NODE_HOST=node1.example.com
APEX_SUBNET=198.18.16.0/24
```

### The OS hostname

The OS hostname is consulted only as a fallback for `APEX_NODE_FQDN`. When `node.env` does not set `APEX_NODE_FQDN`, the engine uses the hostname and emits a warning. It is never parsed for a node name or any other coordinate.

## Resolution order {#resolution}

{{% steps %}}

### Resolve the FQDN

`fqdn` is `APEX_NODE_FQDN` from `node.env`, or the OS hostname when that key is unset. If neither yields a value, resolution fails (see [Failure modes](#failures)).

### Resolve the public host

`host` is `APEX_NODE_HOST` from `node.env`, or `fqdn` when that key is unset.

### Derive the short name

`name` is the **first label** of `host` (`host.split(".")[0]`) — for example, `node1` for `node1.example.com`. It is used for logs, the `sync/<node>` branch, and messages.

### Read the subnet

`subnet` is always read from `APEX_SUBNET` in `node.env`. It is required.

{{% /steps %}}

The result is a `Node` record with four fields: `name`, `subnet`, `fqdn`, and `host`.

## Warnings {#warnings}

Identity resolution emits exactly one warning; it signals a recoverable inconsistency that should be fixed.

| Condition | Warning message |
|---|---|
| `APEX_NODE_FQDN` is unset in `node.env` (the hostname is used instead) | `APEX_NODE_FQDN not set in node.env; using hostname '<fqdn>'.` |

## Failure modes {#failures}

Resolution refuses to guess. Two conditions are fatal, and both exit with code `66` — the engine's exit-code convention for missing input:

- **No FQDN at all.** `APEX_NODE_FQDN` is unset in `node.env` *and* the OS hostname is empty. The engine writes `identity: APEX_NODE_FQDN missing from node.env and no hostname` to stderr and exits.
- **No subnet.** `APEX_SUBNET` is absent from `node.env` (including when the file itself is missing). The engine writes `identity: APEX_SUBNET missing from node.env` to stderr and exits.

> [!WARNING]
> A valid `node.env` carrying `APEX_SUBNET` is required on every node. `APEX_NODE_FQDN` may be omitted only when the OS hostname supplies a usable FQDN.

---

**See also:**

- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
