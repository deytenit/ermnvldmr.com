import { DEFAULT_LOCALE, isLocale, type Locale } from './lib/locale.js';

import type { RsbuildConfig } from '@rsbuild/core';

/**
 * Returns a partial Rsbuild config that enables locale-aware builds.
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
    tools: {
      rspack: (config, { rspack }) => {
        // Resolve .en.mdx imports to the locale-specific file when LOCALE != 'en'.
        // The canonical import is always `.en.mdx`; other locales are resolved here.
        if (locale !== DEFAULT_LOCALE) {
          config.plugins = [
            ...config.plugins,
            new rspack.NormalModuleReplacementPlugin(
              /\.en\.mdx$/,
              (resource: { request: string }) => {
                resource.request = resource.request.replace(/\.en\.mdx$/, `.${locale}.mdx`);
              }
            ),
          ];
        }
        return config;
      },
    },
  };
}

export { LOCALES, DEFAULT_LOCALE, type Locale } from './lib/locale.js';
