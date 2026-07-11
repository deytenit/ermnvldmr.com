import { defineServiceConfig, mergeConfig } from '@ermnvldmr/rsbuild-config/dev';
import { type RsbuildConfig } from '@rsbuild/core';

import { ssgPlugin } from './ssg.js';

/**
 * Defines a complete Rsbuild configuration for SSG services.
 *
 * Wraps `defineServiceConfig` from `@ermnvldmr/rsbuild-config` and pre-injects
 * `ssgPlugin()` so consumers do not need to wire it manually.
 *
 * @param config - Optional Rsbuild configuration overrides.
 * @returns A complete Rsbuild configuration object.
 *
 * @example
 * ```typescript
 * import { defineSSGServiceConfig, discoverEntries } from '@ermnvldmr/ssg/dev';
 *
 * export default defineSSGServiceConfig({
 *   source: { entry: discoverEntries(import.meta.dirname, './src/app/**\/*.tsx') },
 * });
 * ```
 */
export function defineSSGServiceConfig(config: RsbuildConfig = {}): RsbuildConfig {
  return defineServiceConfig(mergeConfig(config, { plugins: [ssgPlugin()] }));
}
