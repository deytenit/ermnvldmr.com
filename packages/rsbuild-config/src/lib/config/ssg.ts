import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import React from 'react';
import type { RsbuildPlugin } from '@rsbuild/core';

/**
 * Rsbuild plugin for build-time Static Site Generation.
 *
 * After the web build completes:
 * 1. Builds each entry as a Node.js CJS bundle (dist-ssr/)
 * 2. Renders each entry with react-dom/server renderToString
 * 3. Injects the rendered HTML into the web build's HTML files
 * 4. Runs critters to inline critical CSS and make the main stylesheet async
 * 5. Cleans up dist-ssr/
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

        // Normalise entries: value may be a string path or an EntryDescription object
        const entries: Record<string, string> = {};
        for (const [name, value] of Object.entries(rawEntries)) {
          if (typeof value === 'string') {
            entries[name] = value;
          } else if (value && typeof value === 'object' && 'import' in value) {
            const imp = (value as { import: string | string[] }).import;
            entries[name] = Array.isArray(imp) ? imp[0] : imp;
          }
        }

        const entryNames = Object.keys(entries);
        if (entryNames.length === 0) {
          console.warn('[ssg-plugin] No entries to process, skipping SSG.');
          return;
        }

        // api.context.distPath is the absolute path to the web build output directory.
        // Fallback: derive from rootPath + output.distPath.root if the property is absent.
        const webDistPath: string =
          (api.context as { distPath?: string }).distPath ??
          path.join(
            api.context.rootPath,
            (config.output?.distPath as { root?: string } | undefined)?.root ?? 'dist'
          );
        const ssrDistPath = path.join(path.dirname(webDistPath), 'dist-ssr');

        // ── Step 1: Build node-target CJS bundles ─────────────────────────────
        console.log('[ssg-plugin] Building SSR bundles...');
        const { createRsbuild } = await import('@rsbuild/core');

        // Reuse web build plugins minus ssgPlugin (avoids recursion) and pluginTypeCheck
        // (type-checking is not needed for the SSR build). This automatically includes
        // pluginReact, pluginMdx, and any other service-level plugins.
        const SSG_PLUGIN_NAME = 'ermnvldmr:ssg-plugin';
        const TYPE_CHECK_PLUGIN_NAME = 'rsbuild:type-check';
        const ssrPlugins = (config.plugins ?? []).filter((p) => {
          if (!p || typeof p !== 'object') return true;
          const name = (p as { name?: string }).name;
          return name !== SSG_PLUGIN_NAME && name !== TYPE_CHECK_PLUGIN_NAME;
        });

        const ssrBuild = await createRsbuild({
          rsbuildConfig: {
            plugins: ssrPlugins,
            source: { entry: entries },
            output: {
              target: 'node',
              distPath: { root: ssrDistPath, js: '.' },
              filename: { js: '[name].cjs' },
            },
          },
        });

        await ssrBuild.build();
        console.log('[ssg-plugin] SSR bundles ready.');

        // ── Step 2: Render, inject, inline critical CSS ───────────────────────
        const { renderToString } = await import('react-dom/server');
        // eslint-disable-next-line @typescript-eslint/no-require-imports -- critters types not resolved via package.json exports
        const Critters = require('critters') as new (opts?: {
          path?: string;
          publicPath?: string;
          preload?: string;
          inlineFonts?: boolean;
          pruneSource?: boolean;
        }) => { process(html: string): Promise<string> };

        // critters `path` is the filesystem root that corresponds to publicPath '/'.
        // It resolves <link href="/css/..."> to webDistPath + '/css/...'.
        // Note: critters does NOT transform url() references inside CSS — only the link tags.
        const critters = new Critters({
          path: webDistPath,
          publicPath: '/',
          preload: 'swap',     // <link rel="preload" as="style" onload="this.rel='stylesheet'">
          inlineFonts: false,  // fonts are handled via separate <link rel="preload"> tags
          pruneSource: false,  // keep full CSS file for post-hydration correctness
        });

        // createRequire from ESM context — shares Node's module cache
        const _require = createRequire(import.meta.url);

        for (const entryName of entryNames) {
          const ssrBundlePath = path.join(ssrDistPath, `${entryName}.cjs`);
          const webHtmlPath = path.join(webDistPath, `${entryName}.html`);

          // Clear module cache so each entry loads fresh
          const resolved = _require.resolve(ssrBundlePath);
          delete _require.cache[resolved];

          const mod = _require(ssrBundlePath) as { default?: React.ComponentType };
          const Component = mod.default;

          if (!Component) {
            console.warn(`[ssg-plugin] Entry "${entryName}" has no default export — skipping.`);
            continue;
          }

          // Render to HTML string
          const renderedHtml = renderToString(
            React.createElement(React.StrictMode, null, React.createElement(Component))
          );

          // Read web HTML, inject rendered content
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

          // Run critters: inline critical CSS, make main stylesheet async
          const processed = await critters.process(injected);

          await fs.writeFile(webHtmlPath, processed, 'utf8');
          console.log(`[ssg-plugin] ✓ ${entryName}`);
        }

        // ── Step 3: Cleanup ───────────────────────────────────────────────────
        await fs.rm(ssrDistPath, { recursive: true, force: true });
        console.log('[ssg-plugin] SSG complete. dist-ssr cleaned up.');
      });
    },
  };
}
