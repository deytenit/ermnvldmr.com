---
title: Concepts
description: "Architecture, identity, actions, execution context, compositions, storage, addressing, and security."
weight: 10
---

Theoretical foundations of the apex fleet-operations framework: how a [node](/apex/glossary#node) declares its [identity](/apex/concepts/node-identity), how [actions](/apex/glossary#action) execute, and how a node organizes its services, storage, and addressing.

{{% cards %}}
{{< card link="architecture" title="Architecture" icon="share" subtitle="The engine, commons, and configs layers and how they fit together." >}}
{{< card link="node-identity" title="Node identity" icon="finger-print" subtitle="How a node declares who it is and where it belongs." >}}
{{< card link="actions-and-overlay" title="Actions and overlay" icon="lightning-bolt" subtitle="Shared actions and node-local overrides." >}}
{{< card link="execution-context" title="Execution context" icon="terminal" subtitle="The environment every action receives at run time." >}}
{{< card link="compositions" title="Compositions" icon="cube" subtitle="How service stacks are declared and deployed per node." >}}
{{< card link="tiered-storage" title="Tiered storage" icon="database" subtitle="Standardized storage classification for service data." >}}
{{< card link="addressing" title="Addressing" icon="globe-alt" subtitle="The node subnet, anchor IPs, and the enclave convention." >}}
{{< card link="security-model" title="Security model" icon="shield-check" subtitle="Privilege isolation and network hardening." >}}
{{% /cards %}}

---

**See also:**

- [Guides: Operating an apex fleet](/apex/guides)
- [Reference: Commands and interfaces](/apex/reference)
