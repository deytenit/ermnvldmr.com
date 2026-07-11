---
title: "Fleet addressing scheme"
description: "Per-node /24 subnets and static anchor IPs inside the enclave space (default 198.18.0.0/16)."
weight: 17
---

Apex assigns every service a fixed, predictable IPv4 address inside a per-node subnet. Each node declares its own `/24`, service anchors are static addresses within it, and the whole scheme is enforced mechanically by the anchor-IP lint.

## Address space {#address-space}

The [enclave](/apex/glossary#enclave) space defaults to `198.18.0.0/16`, the benchmarking range set aside by [RFC 2544: Benchmarking Methodology for Network Interconnect Devices](https://datatracker.ietf.org/doc/html/rfc2544). This range is never routed on the public Internet and does not collide with the common private ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) that cloud providers and home networks already consume. The operator may override it via `APEX_ENCLAVE_SUBNET`.

## Node subnets {#node-subnets}

Each [node](/apex/glossary#node) declares exactly one `/24` as `APEX_SUBNET` in its `node.env`, and that subnet is the `direct` network's IPAM range. The operator assigns it; conventionally it sits inside the enclave space (`198.18.0.0/16` by default, or whatever `APEX_ENCLAVE_SUBNET` is set to), but the framework imposes no arithmetic on the choice.

> [!NOTE]
> As an optional operator convention, you may organize node `/24`s into contiguous blocks (for example, grouping related nodes) to keep allocations legible. This is a bookkeeping choice, not a framework rule.

## Allocation inside a node /24 {#node-allocation}

Within a node's `/24`, host addresses are partitioned by role:

| Range | Purpose |
|---|---|
| `.10`–`.19` | Reserved for [core composition](/apex/glossary#core-composition) anchors; `traefik` is always `.10` (via `APEX_TRAEFIK_DIRECT_IP`) |
| `.20` and up | Service anchors, allocated per `<project>` |

Every service anchor is a static `ipv4_address` on the direct network — a fixed [anchor IP](/apex/glossary#anchor-ip) rather than a dynamically assigned lease. Allocations are recorded in `compositions/ADDRESSING.md`, which serves as the human-readable register for the node's subnet.

## Enforcement {#enforcement}

The compose lint validates anchor IPs across all [compositions](/apex/glossary#compositions) on a node. For every `ipv4_address` found in `compositions/*/docker-compose.yml` it checks that the address is:

- **Well-formed** — a malformed literal is reported as a lint error, not a crash.
- **Unique** — the same anchor IP may not appear in two projects; duplicates are reported with both offending projects.
- **Inside the node subnet** — every anchor must fall within the node's declared `/24`.

Any violation fails the lint with exit code `1` (general error). Passing validation logs `Anchor IP validation passed.` The implementation lives in the `utils/lint-docker-compose` [action](/apex/glossary#action); see [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com).

---

**See also:**

- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
- [RFC 2544: Benchmarking Methodology for Network Interconnect Devices](https://datatracker.ietf.org/doc/html/rfc2544)
