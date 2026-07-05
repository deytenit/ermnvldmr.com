---
title: Documentation of the apex fleet operations framework
description: "Documentation for the apex fleet operations framework: a stdlib-python engine and a shared compose core for self-hosted nodes."
weight: 1
type: docs
cascade:
  type: docs
---

`apex` is the [commons](/apex/glossary#commons) of a fleet of self-hosted [nodes](/apex/glossary#node): a python3-stdlib [engine](/apex/glossary#engine) that runs grouped [actions](/apex/glossary#action) as `apex <group>/<action>`, paired with a shared, `${env}`-parameterized docker-compose core. Every node repository consumes the framework as the pinned `commons/` git submodule. apex succeeds the bash `root` commons framework.

The stack is deliberately small: `git` plus the Python 3 standard library. There is no `pip`, Node, Go, or CUE, and compose files are hand-authored — no code generation.

## Core features

- **Single entrypoint on the local checkout** — `apex` always acts on the checkout it runs from; there is no `<node>` argument to pass.
- **Identity from the host** — [node identity](/apex/glossary#node-identity) is derived from the host FQDN (`<node>.a<x>.apex.ermnvldmr.com`) and the `node.env` file.
- **Four-pillar node repositories** — every node repository follows the same shape: the pinned `commons/` submodule, node-local [proprietaries](/apex/glossary#proprietaries), the node's [compositions](/apex/glossary#compositions), and its `node.env`.
- **Proprietary overlay** — node-local proprietaries are [overlaid](/apex/glossary#overlay) over the shared actions; commons holds only what every node shares.
- **Tiered storage with privilege isolation** — standardized storage [tiers](/apex/glossary#tier) with per-project privilege isolation.
- **Shared core composition** — the [core composition](/apex/glossary#core-composition) (`compositions/apex/docker-compose.yml`) is `${env}`-parameterized and included in every node's compositions.

## Sections

{{% cards %}}
{{< card link="getting-started" title="Getting started" icon="map" subtitle="Prerequisites, bootstrap, and the first actions on a fresh node." >}}
{{< card link="concepts" title="Concepts" icon="book-open" subtitle="Architecture, identity, the overlay, and the storage model." >}}
{{< card link="guides" title="Guides" icon="map" subtitle="Task-oriented guides for operating and extending a node." >}}
{{< card link="reference" title="Reference" icon="code" subtitle="Actions, the engine helper library, and exit codes." >}}
{{< card link="troubleshooting" title="Troubleshooting" icon="shield-check" subtitle="Symptoms, diagnosis, and fixes for common failures." >}}
{{% /cards %}}

---

**See also:**

- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
