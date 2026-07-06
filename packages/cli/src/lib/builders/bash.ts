import type { BashCommandConfig } from '../types.js';

/**
 * Creates a Bash command configuration.
 *
 * @param config - The command configuration excluding the 'type' field.
 * @returns The fully formatted Bash command configuration.
 * @example
 * ```typescript
 * const config = bashCommand({
 *   name: 'hello',
 *   description: 'says hello',
 *   script: 'echo "hello"'
 * });
 * ```
 */
export function bashCommand(
  config: Omit<BashCommandConfig, 'type'>
): BashCommandConfig {
  return {
    ...config,
    type: 'bash',
  };
}
