import { DEFAULT_LOCALE, isLocale, type Locale } from './lib/locale.js';

import type { RsbuildConfig, RsbuildPlugin } from '@rsbuild/core';

/**
 * Returns a partial Rsbuild config that enables locale-aware builds.
 *
 * The locale MDX replacement is provided as an Rsbuild plugin (rather than a
 * `tools.rspack` function) so that `mergeConfig` can safely concatenate it
 * with the service's own `plugins` array. A `tools.rspack` function would be
 * silently dropped by `mergeConfig` when the service config also defines
 * `tools.rspack` as a plain object.
 *
 * Designed to be merged with defineServiceConfig() in each service's rsbuild.config.ts:
 *
 * @example
 * ```ts
 * import { localeRsbuildConfig } from '@ermnvldmr/i18n/dev';
 * import { defineServiceConfig, mergeConfig } from '@ermnvldmr/rsbuild-config/dev';
 *
 * export default defineServiceConfig(mergeConfig(localeRsbuildConfig(), { ... }));
 * ```
 */
export function localeRsbuildConfig(): RsbuildConfig {
  const rawLocale = process.env.LOCALE ?? '';
  const locale: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const localePlugins: RsbuildPlugin[] = [];

  if (locale !== DEFAULT_LOCALE) {
    localePlugins.push({
      name: 'ermnvldmr:locale-mdx-replacement',
      setup(api) {
        // Resolve .en.mdx imports to the locale-specific file when LOCALE != 'en'.
        // The canonical import is always `.en.mdx`; other locales are resolved here.
        api.modifyRspackConfig((config, { rspack }) => {
          config.plugins = [
            ...(config.plugins ?? []),
            new rspack.NormalModuleReplacementPlugin(
              /\.en\.mdx$/,
              (resource: { request: string }) => {
                resource.request = resource.request.replace(/\.en\.mdx$/, `.${locale}.mdx`);
              }
            ),
          ];
          return config;
        });
      },
    });
  }

  return {
    source: {
      define: {
        'process.env.LOCALE': JSON.stringify(locale),
      },
    },
    server: {
      // Dev server serves pages under the locale base so localePath() links
      // resolve correctly in dev without any NODE_ENV branching.
      base: `/${locale}`,
    },
    output: {
      distPath: {
        root: `dist/${locale}`,
      },
      assetPrefix: `/${locale}/`,
    },
    plugins: localePlugins,
  };
}

export { LOCALES, DEFAULT_LOCALE, type Locale } from './lib/locale.js';
