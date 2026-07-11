import type { CliConfig } from './lib/types.js';

/**
 * Helper function to define the CLI configuration with strict type-safety.
 *
 * @param config - The CLI configuration containing the array of commands.
 * @returns The unmodified CLI configuration.
 * @example
 * ```typescript
 * const config = defineCli({
 *   commands: [
 *     bashCommand({ name: 'hello', description: 'say hello', script: 'echo hello' })
 *   ]
 * });
 * ```
 */
export function defineCli(config: CliConfig): CliConfig {
  return config;
}

export { bashCommand } from './lib/builders/bash.js';
export { nodeCommand } from './lib/builders/node.js';
export { s3SyncCommand } from './lib/builders/s3Sync.js';
export { env } from './lib/env.js';
export * from './lib/types.js';
