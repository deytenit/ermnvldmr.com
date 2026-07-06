# @ermnvldmr/cli

An extensible, configuration-driven CLI toolkit designed specifically for the ermnvldmr monorepo. 

## Overview

The `@ermnvldmr/cli` package provides a unified way to declare, manage, and execute scripts across different packages and services in the monorepo. Instead of cluttering `package.json` with complex bash scripts or maintaining ad-hoc Node.js script files, developers can define their package's commands in a strongly-typed `.config/cli.ts` file.

Under the hood, it uses [Commander.js](https://github.com/tj/commander.js) for argument parsing and [JITI](https://github.com/unjs/jiti) for seamless, dynamic TypeScript execution.

## Features

- **Centralized Configuration:** Define all commands in a single `.config/cli.ts` file per package.
- **Type-Safe Builders:** Use `bashCommand` and `nodeCommand` builders to get strict TypeScript inference.
- **Bash & Node Support:** Easily execute shell scripts (via `execa`) or arbitrary asynchronous Node.js functions.
- **Commander Integration:** Automatically registers commands, descriptions, and arguments into a robust CLI interface.

## Installation

This package is intended to be used as a development dependency within the monorepo's workspace packages.

```bash
pnpm add -D @ermnvldmr/cli --workspace
```

## Usage

### 1. Create a Configuration File

Create a `.config/cli.ts` file in the root of your package/service (e.g., `packages/ui/.config/cli.ts`).

```typescript
import { defineCli, bashCommand, nodeCommand } from '@ermnvldmr/cli';

export default defineCli({
  commands: [
    bashCommand({
      name: 'hello',
      description: 'Prints a hello message via bash',
      script: 'echo "Hello from Bash!"'
    }),
    
    nodeCommand({
      name: 'build:custom',
      description: 'Runs a custom node build step',
      options: [
        {
          flags: '--minify',
          description: 'Enable minification',
          defaultValue: false
        }
      ],
      action: async (options) => {
        console.log('Building with node...');
        if (options.minify) {
          console.log('Minification enabled!');
        }
      }
    })
  ]
});
```

### 2. Run the CLI

You can invoke the CLI directly using `pnpm exec` from the package directory:

```bash
pnpm exec ermnvldmr-cli hello
pnpm exec ermnvldmr-cli build:custom --minify
```

Alternatively, you can wire it into your `package.json` scripts:

```json
{
  "scripts": {
    "cli": "ermnvldmr-cli",
    "hello": "ermnvldmr-cli hello"
  }
}
```

## API Reference

### `defineCli(config: CliConfig)`

An identity helper function that provides strict TypeScript type-inference for your configuration object. It returns the configuration unmodified.

### `bashCommand(config: Omit<BashCommandConfig, 'type'>)`

A builder function for defining shell commands. 
- **`script`**: The exact bash string to execute. It will be executed using `execa` with `shell: true` and `stdio: 'inherit'`.

### `nodeCommand(config: Omit<NodeCommandConfig, 'type'>)`

A builder function for defining arbitrary JavaScript/TypeScript actions.
- **`action`**: An asynchronous function `(options: Record<string, unknown>) => Promise<void> | void` that executes when the command is invoked.

## Development

This package adheres to the global monorepo standards outlined in `GEMINI.md`:
- **Strict TypeScript**: No `any` types are permitted.
- **TSDoc**: All exported members must include comprehensive TSDoc comments.
- **TDD**: Modifications and new builders should be accompanied by Vitest unit tests.
