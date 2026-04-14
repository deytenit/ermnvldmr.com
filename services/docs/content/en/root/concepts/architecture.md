---
title: Infrastructure architecture
description: The decentralized orchestration model and deployment structure.
weight: 10
---

The Root framework operates on a decentralized orchestration model designed for independent, self-contained projects. It enforces a strict separation between the orchestrator (the "brain") and the automation tasks (the "muscle").

## Core philosophy {#philosophy}

The framework is built on the **Smart Root, Stupid Actions** principle. This design ensures that individual automation scripts remain declarative and unaware of the global system state, while the central dispatcher handles environment resolution and library initialization.

### Smart Root (The Dispatcher)

The `root` entrypoint is the sole interface for users. It is responsible for:

- **Environment resolution** &rarr; Locating the `commons` and `configs` repositories.
- **Library warming** &rarr; Sourcing namespaced modules exactly once.
- **Context establishment** &rarr; Defining the target [Node](/root/glossary#node) and its associated paths.

### Stupid Actions (The Tasks)

[Actions](/root/glossary#action) are declarative scripts located in `scripts/actions/`. They are "stupid" because:

- They do not calculate paths or detect repositories.
- They depend entirely on the `ROOT_` environment variables.
- They focus exclusively on a single atomic task (e.g., `compose`, `ufw`).

## Deployment model {#deployment}

The framework is typically deployed as a shared [Commons](/root/glossary#commons) repository mounted as a Git submodule within a configuration repository. The engine powering this shared infrastructure is hosted at [GitHub: ermnvldmr.com-root-commons](https://github.com/deytenit/ermnvldmr.com-root-commons).

{{< filetree/container >}}
{{< filetree/folder name="configs-repo" state="open" >}}
  {{< filetree/folder name=".operator" state="open" >}}
    {{< filetree/folder name="shared (submodule)" state="open" >}}
      {{< filetree/folder name="scripts" >}}
        {{< filetree/folder name="run" >}}
          {{< filetree/file name="root (dispatcher)" >}}
        {{< /filetree/folder >}}
        {{< filetree/folder name="lib" >}}
          {{< filetree/file name="shared libraries" >}}
        {{< /filetree/folder >}}
        {{< filetree/folder name="actions" >}}
          {{< filetree/file name="shared actions" >}}
        {{< /filetree/folder >}}
      {{< /filetree/folder >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="local" state="open" >}}
      {{< filetree/folder name="scripts" >}}
        {{< filetree/folder name="actions" >}}
          {{< filetree/file name="node-specific overrides" >}}
        {{< /filetree/folder >}}
      {{< /filetree/folder >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
  {{< filetree/folder name="daedalus (node)" >}}
    {{< filetree/file name="docker-compose.yml" >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="init.sh (bootstrap)" >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

---

**See also:**

- [Concept: The ROOT_ API](/root/reference/root-api)
- [Guide: Installation](/root/guides/installation)
- [GitHub: ermnvldmr.com-root-commons](https://github.com/deytenit/ermnvldmr.com-root-commons)
