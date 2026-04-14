---
title: The `source/` Directory
description: Conceptual overview of the self-contained source directory structure.
weight: 52
---

The `source/` directory at the repository root contains the core components and projects that the Root framework orchestrates. It is designed for maximum isolation and self-containment.

## Core Philosophy {#philosophy}

The `source/` directory is not just a place to store code; it is a collection of independent [Projects](/root/glossary#project). Each project within this directory should follow these principles:

1. **Isolation**: Each project lives in its own subdirectory (e.g., `source/my-app/`).
2. **Self-Documentation**: Each project directory **MUST** contain its own `README.md` file describing its purpose, dependencies, and configuration.
3. **Internal Logic**: Projects handle their own build processes, Dockerfiles, and internal configurations. The Root framework's [Actions](/root/glossary#action) simply orchestrate these existing components.

## Directory Structure {#structure}

A typical project within the `source/` directory might look like this:

{{< filetree/container >}}
{{< filetree/folder name="source" state="open" >}}
  {{< filetree/folder name="happ-subscription-generator" state="open" >}}
    {{< filetree/file name="Dockerfile" >}}
    {{< filetree/file name="generator.py" >}}
    {{< filetree/file name="README.md" >}}
  {{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

## Relationship with Actions {#actions}

Root actions (like `compose` or `sync`) interact with the `source/` directory by referencing paths within it. For example, the `compose` action might use a `docker-compose.yml` file that points to a `Dockerfile` located in `source/app/`.

This separation of concerns ensures that the orchestration logic (Actions) remains decoupled from the implementation details (Source).

---

**See also:**

- [Concept: Infrastructure Architecture](/root/concepts/architecture)
- [Reference: ROOT_ API Reference](/root/reference/root-api)
