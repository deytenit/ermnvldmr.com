---
title: "Fleet addressing scheme"
description: "Cluster-aligned /20 blocks with nibble-aligned node /24s inside 198.18.0.0/16."
weight: 17
---

Apex assigns every service a fixed, predictable IPv4 address inside a single fleet-wide address space. The scheme is arithmetic — given a cluster and a node, the subnet is derivable without a lookup — and it is enforced mechanically by the anchor-IP lint.

## Address space {#address-space}

The [enclave](/apex/glossary#enclave) occupies `198.18.0.0/16`, the benchmarking range set aside by [RFC 2544: Benchmarking Methodology for Network Interconnect Devices](https://datatracker.ietf.org/doc/html/rfc2544). This range is never routed on the public Internet and does not collide with the common private ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) that cloud providers and home networks already consume.

## Cluster blocks {#cluster-blocks}

Each [cluster](/apex/glossary#cluster) `aX` owns one /20 block, computed from its index:

```text
cluster aX → 198.18.(16 * X).0/20
```

For example, cluster `a1` owns `198.18.16.0/20` and cluster `a2` owns `198.18.32.0/20`.

> [!NOTE]
> The zero block `198.18.0.0/20` is reserved (legacy). Usable cluster indexes start at `1`.

## Node subnets {#node-subnets}

Each [node](/apex/glossary#node) takes exactly one /24 inside its cluster's /20 block. The third octet of a node subnet reads as two hex nibbles — `0x<cluster><node>` — so the address itself encodes both coordinates:

| Subnet | Third octet | Nibbles | Meaning |
|---|---|---|---|
| `198.18.16.0/24` | `16` | `0x10` | cluster `a1`, node index `0` |
| `198.18.17.0/24` | `17` | `0x11` | cluster `a1`, node index `1` |
| `198.18.33.0/24` | `33` | `0x21` | cluster `a2`, node index `1` |

A /20 block spans 16 third-octet values, so the capacity of the scheme is **15 clusters of 16 nodes each** — the sixteenth /20 slot is the reserved legacy block above.

## Allocation inside a node /24 {#node-allocation}

Within a node's /24, host addresses are partitioned by role:

| Range | Purpose |
|---|---|
| `.10`–`.19` | Reserved for [core composition](/apex/glossary#core-composition) anchors; `traefik` is always `.10` |
| `.20` and up | Service anchors, allocated per `<project>` |

Every service anchor is a static `ipv4_address` on the direct network — a fixed [anchor IP](/apex/glossary#anchor-ip) rather than a dynamically assigned lease. Allocations are recorded in `compositions/ADDRESSING.md`, which serves as the human-readable register for the node's subnet.

## Enforcement {#enforcement}

The compose lint validates anchor IPs across all [compositions](/apex/glossary#compositions) on a node. For every `ipv4_address` found in `compositions/*/docker-compose.yml` it checks that the address is:

- **Well-formed** — a malformed literal is reported as a lint error, not a crash.
- **Unique** — the same anchor IP may not appear in two projects; duplicates are reported with both offending projects.
- **Inside the node subnet** — every anchor must fall within the node's declared /24.

Any violation fails the lint with exit code `1` (general error). Passing validation logs `Anchor IP validation passed.` The implementation lives in the `utils/lint-docker-compose` [action](/apex/glossary#action); see [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com).

---

**See also:**

- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
- [RFC 2544: Benchmarking Methodology for Network Interconnect Devices](https://datatracker.ietf.org/doc/html/rfc2544)
