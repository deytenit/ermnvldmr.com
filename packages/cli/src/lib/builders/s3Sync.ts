import type { S3SyncCommandConfig } from '../types.js';

/**
 * Creates an S3 Sync command configuration.
 *
 * @param config - The command configuration excluding the 'type' field.
 * @returns The fully formatted S3 Sync command configuration.
 * @example
 * ```typescript
 * const config = s3SyncCommand({
 *   name: 'sync',
 *   description: 'Sync files',
 *   targetPrefix: 'www'
 * });
 * ```
 */
export function s3SyncCommand(
  config: Omit<S3SyncCommandConfig, 'type'>
): S3SyncCommandConfig {
  return {
    ...config,
    type: 's3-sync',
  };
}
