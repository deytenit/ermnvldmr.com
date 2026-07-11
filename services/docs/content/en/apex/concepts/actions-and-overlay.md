---
title: "Actions and the overlay"
description: "The action contract and how node-local proprietaries shadow commons actions."
weight: 13
---

Every unit of automation in apex is an [action](/apex/glossary#action): a single Python module that the [engine](/apex/glossary#engine) dispatches by name. The [overlay](/apex/glossary#overlay) lets a node's [proprietaries](/apex/glossary#proprietaries) add, override, or disable [commons](/apex/glossary#commons) actions without forking them. This page defines the action contract, the declarative argument descriptors, and the resolution rules.

## The action contract {#contract}

An action is one `.py` file under an `actions/` tree. The file path **is** the action name: `actions/<group>/<action>.py` is invoked as `apex <group>/<action> [args...]`. There is no registry to update — dropping a file into the tree publishes the action.

The module must expose two things:

- **`METADATA = Meta(...)`** &rarr; the summary and argument descriptors that drive both the help text and parsing. The descriptor system succeeds the `action_metadata()` heredoc of the bash "root" commons framework, apex's predecessor.
- **`run(ctx, args)`** &rarr; the entrypoint. `ctx` is the engine-built execution context; `args` is the parsed `argparse` namespace.

```python {filename="actions/<group>/<action>.py"}
from engine.descriptor import Meta, Arg, Flag

METADATA = Meta(
    summary="One-line summary shown in the action listing",
    args=[
        Arg("target", help="A required positional argument"),
        Flag("--dry-run", help="A boolean flag"),
    ],
)

def run(ctx, args):
    ...
    return 0
```

The return value of `run` becomes the process exit code. A non-integer return (including `None`) is treated as success (`0`). An unhandled exception is logged with the context prefix and exits `1`.

> [!NOTE]
> `METADATA` is technically optional — a module without it is dispatched with an empty `Meta` and accepts no arguments — but every real action should declare it, since the listing and `--help` output are generated from it.

## Declarative arguments {#arguments}

`Meta.args` is a list of descriptors. Each maps to exactly one `argparse` construct:

| Descriptor | Maps to | Behavior |
| --- | --- | --- |
| `Arg("name")` | positional argument | Required by default; `required=False` makes it an optional positional (`nargs="?"`, default `None`). |
| `Opt("--name", default=...)` | value option | An optional flag that takes a value, with a declared default. |
| `Flag("--name")` | boolean flag | `store_true`; present means `True`. |
| `Rest("name")` | remainder | Greedy passthrough of all remaining argv (`argparse.REMAINDER`). |

The engine builds the parser as `apex <group>/<action>` and parses the remaining argv before calling `run`. `--help` is handled at parse time. A usage error — unknown flag, missing positional — prints usage and exits `64` (`EX_USAGE`) instead of argparse's default `2`.

## Listing without importing {#listing}

`apex` with no arguments (or `--help`) lists every available action. Listing never imports action modules: the engine statically scans each file with the `ast` module and extracts only the `METADATA` summary and any `DISABLED` constant. Action code therefore cannot run — or crash — at list time; a file that fails to parse is listed as `(unparseable)` rather than breaking the listing.

Each entry is tagged with its overlay source:

- no tag &rarr; a commons action,
- `(local)` &rarr; exists only in proprietaries,
- `(local override)` &rarr; a proprietaries action shadowing a commons one,
- `[DISABLED: reason]` &rarr; the action declares `DISABLED`.

## The overlay {#overlay}

Action names are resolved across two trees, proprietaries first:

{{< filetree/container >}}
{{< filetree/folder name="node repository" state="open" >}}
  {{< filetree/file name="node.env" >}}
  {{< filetree/folder name="commons" state="open" >}}
    {{< filetree/folder name="engine" state="closed" >}}{{< /filetree/folder >}}
    {{< filetree/folder name="actions" state="open" >}}
      {{< filetree/file name="<group>/<action>.py" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
  {{< filetree/folder name="proprietaries" state="open" >}}
    {{< filetree/folder name="actions" state="open" >}}
      {{< filetree/file name="<group>/<action>.py" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

The engine detects this layout by its own location: when it runs from a `commons/` directory whose parent contains `node.env`, the parent is the [node](/apex/glossary#node) repository root and `proprietaries/actions/` is the overlay tree. A standalone commons checkout is its own root and has no overlay layer. Inside a node repository, [node identity](/apex/glossary#node-identity) is resolved from the host FQDN before dispatch.

Resolution for a given name checks `proprietaries/actions/<name>.py` first and `commons/actions/<name>.py` second; exactly one module is loaded by path. An unknown name is an error (exit `1`). The overlay supports four moves:

- **Add** &rarr; a file that exists only in proprietaries becomes a node-local action, listed as `(local)`.
- **Override** &rarr; a proprietaries file at the same relative path shadows the commons implementation entirely; the commons path is recorded on the resolution as `shadowed`.
- **Wrap** &rarr; an overriding module can delegate to the implementation it shadows via `ctx.commons.run(args)`, adding node-local behavior before or after the commons logic instead of replacing it.
- **Disable** &rarr; a module that assigns `DISABLED = "reason"` is refused at dispatch: the engine logs the reason and exits `1`. The listing shows `[DISABLED: reason]`. A bare `DISABLED = True` also disables, with the generic reason `disabled`; an empty string does not.

## Exit codes {#exit-codes}

Actions and the engine follow a fixed exit-code convention:

| Code | Meaning | Typical cause |
| --- | --- | --- |
| `0` | success | `run` returned `0` or a non-integer. |
| `1` | general error | Unknown action, disabled action, unhandled exception, non-integer `SystemExit`. |
| `64` | usage error | Arguments rejected by the parser (`EX_USAGE`). |
| `65` | data error | Malformed input data (`EX_DATAERR`), raised by engine libraries. |
| `66` | missing input | A required input is absent (`EX_NOINPUT`), raised by engine libraries. |

---

**See also:**

- [Concept: Framework architecture](/apex/concepts/architecture)
- [Concept: The execution context](/apex/concepts/execution-context)
- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
