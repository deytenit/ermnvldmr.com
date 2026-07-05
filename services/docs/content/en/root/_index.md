---
title: Documentation of ermnvldmr.com root deployment commons
description: Documentation for the ermnvldmr.com root deployment commons framework.
weight: 2
type: docs
cascade:
  type: docs
---

> [!WARNING]
> **Deprecated.** The root framework has been superseded by the
> [apex fleet operations framework](/apex) — a python-stdlib rewrite of the engine with a
> shared compose core. This section is retained for reference only and no longer receives
> updates.

The `ermnvldmr.com-root-commons` framework provides a minimal-dependency deployment environment for independent, self-hosted projects.

The generic logic, scripts, and deployment patterns used across multiple unrelated self-hosted applications are stored in the [GitHub: ermnvldmr.com-root-commons](https://github.com/deytenit/ermnvldmr.com-root-commons) repository.

## Core features

- **Smart Dispatcher**: A single entrypoint (`root`) for all orchestration tasks.
- **Tiered Storage**: Standardized classification for configuration, data, and logs.
- **Privilege Isolation**: Project-specific non-root users for enhanced security.
- **Namespaced Libraries**: Explicit, modular Bash utilities for consistent automation.

## Sections

{{% cards %}}
{{< card link="concepts" title="Concepts" icon="book-open" subtitle="Theoretical foundations, architecture, and security models." >}}
{{< card link="guides" title="Guides" icon="map" subtitle="Step-by-step guides for installation and action development." >}}
{{< card link="reference" title="Reference" icon="code" subtitle="API and technical references for developers." >}}
{{% /cards %}}

---

**See also:**

- [GitHub: ermnvldmr.com-root-commons](https://github.com/deytenit/ermnvldmr.com-root-commons)
