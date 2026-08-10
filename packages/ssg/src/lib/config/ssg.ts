import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import React from 'react';

import type { RsbuildPlugin } from '@rsbuild/core';

const SSR_RUNNER_SCRIPT = `
import { createRsbuild } from '@rsbuild/core';

async function main() {
  const entries = JSON.parse(process.argv[1]);
  const ssrDistPath = process.argv[2];

  const plugins = [];
  try {
    const { pluginMdx } = await import('@rsbuild/plugin-mdx');
    const { default: remarkFrontmatter } = await import('remark-frontmatter');
    const { default: remarkMdxFrontmatter } = await import('remark-mdx-frontmatter');

    plugins.push(
      pluginMdx({
        mdxLoaderOptions: {
          remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'frontmatter' }]],
        },
      })
    );
  } catch (_err) {
    // MDX plugins not installed or needed in this service
  }

  const ssrBuild = await createRsbuild({
    rsbuildConfig: {
      plugins,
      source: { entry: entries },
      output: {
        target: 'node',
        distPath: { root: ssrDistPath, js: '.' },
        filename: { js: '[name].cjs' },
        cleanDistPath: false,
        externals: {
          react: 'commonjs react',
          'react-dom': 'commonjs react-dom',
          'react/jsx-runtime': 'commonjs react/jsx-runtime',
          'react/jsx-dev-runtime': 'commonjs react/jsx-dev-runtime',
        },
      },
    },
  });

  await ssrBuild.build();
}

main().catch((err) => {
  console.error('[ssg-runner] SSR build failed:', err);
  process.exit(1);
});
`;

/**
 * Rsbuild plugin for build-time Static Site Generation.
 *
 * After the web build completes:
 * 1. Builds each entry as a Node.js CJS bundle (dist-ssr/) via isolated process
 * 2. Renders each entry with react-dom/server renderToString
 * 3. Injects the rendered HTML into the web build's HTML files
 * 4. Runs critters to inline critical CSS and make the main stylesheet async
 * 5. Cleans up dist-ssr/
 *
 * @example
 * ```typescript
 * ssgPlugin()
 * ```
 */
export function ssgPlugin(): RsbuildPlugin {
  return {
    name: 'ermnvldmr:ssg-plugin',
    setup(api) {
      api.onAfterBuild(async ({ stats }) => {
        if (!stats) {
          console.warn('[ssg-plugin] No stats available, skipping SSG.');
          return;
        }

        const config = api.getRsbuildConfig();
        const rawEntries = config.source?.entry;

        if (!rawEntries || typeof rawEntries !== 'object' || Array.isArray(rawEntries)) {
          console.warn('[ssg-plugin] source.entry is not an object map, skipping SSG.');
          return;
        }

        const entries: Record<string, string> = {};
        for (const [name, value] of Object.entries(rawEntries)) {
          if (typeof value === 'string') {
            entries[name] = value;
          } else if (typeof value === 'object' && 'import' in value) {
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            const imp = (value as { import: string | string[] }).import;
            entries[name] = Array.isArray(imp) ? (imp[0] ?? '') : imp;
          }
        }

        const entryNames = Object.keys(entries);
        if (entryNames.length === 0) {
          console.warn('[ssg-plugin] No entries to process, skipping SSG.');
          return;
        }

        const webDistPath: string =
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          (api.context as { distPath?: string }).distPath ??
          path.join(
            api.context.rootPath,
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            (config.output?.distPath as { root?: string } | undefined)?.root ?? 'dist'
          );
        const ssrDistPath = path.join(path.dirname(webDistPath), 'dist-ssr');

        console.log('[ssg-plugin] Building SSR bundles...');
        execFileSync(
          process.execPath,
          ['--input-type=module', '-e', SSR_RUNNER_SCRIPT, JSON.stringify(entries), ssrDistPath],
          { stdio: 'inherit' }
        );
        console.log('[ssg-plugin] SSR bundles ready.');

        const { renderToString } = await import('react-dom/server');
        const _require = createRequire(import.meta.url);

        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const Critters = _require('critters') as new (opts?: {
          path?: string;
          publicPath?: string;
          preload?: string;
          inlineFonts?: boolean;
          pruneSource?: boolean;
          reduceInlineStyles?: boolean;
        }) => { process(html: string): Promise<string> };

        const configuredAssetPrefix =
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          (config.output as { assetPrefix?: string } | undefined)?.assetPrefix ?? '/';

        const critters = new Critters({
          path: webDistPath,
          publicPath: configuredAssetPrefix,
          preload: 'swap',
          inlineFonts: false,
          pruneSource: false,
          reduceInlineStyles: false,
        });

        for (const entryName of entryNames) {
          const ssrBundlePath = path.join(ssrDistPath, `${entryName}.cjs`);
          const webHtmlPath = path.join(webDistPath, `${entryName}.html`);

          const resolved = _require.resolve(ssrBundlePath);
          delete _require.cache[resolved];

          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          const mod = _require(ssrBundlePath) as { default?: React.ComponentType };
          const Component = mod.default;

          if (!Component) {
            console.warn(`[ssg-plugin] Entry "${entryName}" has no default export — skipping.`);
            continue;
          }

          const renderedHtml = renderToString(
            React.createElement(React.StrictMode, null, React.createElement(Component))
          );

          const source = await fs.readFile(webHtmlPath, 'utf8');
          const injected = source.replace(
            /<div id="root"[^>]*>\s*<\/div>/,
            `<div id="root">${renderedHtml}</div>`
          );

          if (injected === source) {
            console.warn(
              `[ssg-plugin] Could not find <div id="root"> in ${webHtmlPath} — injection skipped.`
            );
          }

          const processed = await critters.process(injected);

          const locale = process.env.LOCALE ?? 'en';
          const localized = processed.replace(
            /<html([^>]*)\slang="[^"]*"/,
            `<html$1 lang="${locale}"`
          );

          await fs.writeFile(webHtmlPath, localized, 'utf8');
          console.log(`[ssg-plugin] ✓ ${entryName}`);
        }

        await fs.rm(ssrDistPath, { recursive: true, force: true });
        console.log('[ssg-plugin] SSG complete. dist-ssr cleaned up.');
      });
    },
  };
}
