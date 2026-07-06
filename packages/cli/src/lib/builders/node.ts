import type { NodeCommandConfig } from '../types.js';

/**
 * Creates a Node command configuration.
 *
 * @param config - The command configuration excluding the 'type' field.
 * @returns The fully formatted Node command configuration.
 * @example
 * ```typescript
 * const config = nodeCommand({
 *   name: 'run',
 *   description: 'runs action',
 *   action: () => console.log('hello')
 * });
 * ```
 */
export function nodeCommand(
  config: Omit<NodeCommandConfig, 'type'>
): NodeCommandConfig {
  return {
    ...config,
    type: 'node',
  };
}
