import { defineConfig, type RsbuildConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import { pluginDts } from 'rsbuild-plugin-dts';

/**
 * Defines a standard Rsbuild configuration for services (apps).
 *
 * @param config - Optional Rsbuild configuration overrides
 * @returns A complete Rsbuild configuration object
 *
 * @example
 * ```typescript
 * import { defineServiceConfig } from '@ermnvldmr/rsbuild-config/dev';
 * export default defineServiceConfig({
 *   source: { entry: { index: './src/main.ts' } }
 * });
 * ```
 */
export function defineServiceConfig(config: RsbuildConfig = {}): RsbuildConfig {
  return defineConfig({
    plugins: [pluginReact(), pluginTypeCheck()],
    output: {
      distPath: {
        font: 'static/font',
      },
      filename: {
        font: '[name][ext]',
      },
    },
    html: {
      template: './src/static/index.html',
      meta: {
        description: 'Thoughts and creations of mine',
      },
      tags: [
        {
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href: '/static/font/lato-var.woff2',
            crossorigin: true,
          },
        },
        {
          tag: 'style',
          children: `
            :root { background-color: #f6f6f6; color: #262626; }
            .dark { background-color: #262626; color: #f6f6f6; }
            body { margin: 0; transition: background-color 0.2s ease; }
          `,
          head: true,
        },
      ],
    },
    ...config,
  });
}

/**
 * Defines a standard Rsbuild configuration for packages (libraries).
 *
 * @param config - Optional Rsbuild configuration overrides
 * @returns A complete Rsbuild configuration object
 *
 * @example
 * ```typescript
 * import { definePackageConfig } from '@ermnvldmr/rsbuild-config/dev';
 * export default definePackageConfig({
 *   output: { target: 'node' }
 * });
 * ```
 */
export function definePackageConfig(config: RsbuildConfig = {}): RsbuildConfig {
  return defineConfig({
    plugins: [pluginReact(), pluginTypeCheck(), pluginDts()],
    output: {
      distPath: {
        root: './dist',
        js: '.',
      },
      target: 'web',
    },
    tools: {
      htmlPlugin: false,
    },
    ...config,
  });
}
