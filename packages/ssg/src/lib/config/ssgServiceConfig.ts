import { defineServiceConfig, mergeConfig } from '@ermnvldmr/rsbuild-config/dev';

import { ssgPlugin } from './ssg.js';

import type { AnalyticsProvider } from './analytics/types.js';
import type { RsbuildConfig } from '@rsbuild/core';

/**
 * Configuration options for SSG services, extending standard Rsbuild config.
 */
export interface SSGServiceConfigOptions extends RsbuildConfig {
  /**
   * Optional analytics integrations (e.g., Umami, Plausible).
   * Providers generate HTML script tags that are injected into `html.tags` in production builds.
   */
  analytics?: AnalyticsProvider[];
}

/**
 * Defines a complete Rsbuild configuration for SSG services.
 *
 * Wraps `defineServiceConfig` from `@ermnvldmr/rsbuild-config`, pre-injects
 * `ssgPlugin()`, and automatically resolves analytics provider HTML tags for production builds.
 *
 * @param config - Optional Rsbuild configuration overrides with analytics integrations.
 * @returns A complete Rsbuild configuration object.
 *
 * @example
 * ```typescript
 * import { defineSSGServiceConfig, discoverEntries, umamiAnalytics } from '@ermnvldmr/ssg/dev';
 *
 * export default defineSSGServiceConfig({
 *   source: { entry: discoverEntries(import.meta.dirname, './src/app/**\/*.tsx') },
 *   analytics: [
 *     umamiAnalytics({
 *       serverUrl: 'https://umami.ermnvldmr.com',
 *       websiteId: '4fca5ac2-4fe4-4626-b708-933c37bfe918',
 *       domains: 'ermnvldmr.com,www.ermnvldmr.com',
 *     }),
 *   ],
 * });
 * ```
 */
export function defineSSGServiceConfig(config: SSGServiceConfigOptions = {}): RsbuildConfig {
  const { analytics, ...rsbuildConfig } = config;
  const isProduction = process.env.NODE_ENV === 'production';

  const analyticsTags = analytics?.flatMap((provider) => provider.getHtmlTags(isProduction)) ?? [];

  const analyticsConfig: RsbuildConfig =
    analyticsTags.length > 0
      ? {
          html: {
            tags: analyticsTags,
          },
        }
      : {};

  const baseConfigWithPlugins = mergeConfig(rsbuildConfig, { plugins: [ssgPlugin()] });

  return defineServiceConfig(mergeConfig(baseConfigWithPlugins, analyticsConfig));
}
