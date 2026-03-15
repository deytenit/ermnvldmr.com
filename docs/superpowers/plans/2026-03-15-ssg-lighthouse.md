# SSG Micro-Framework & Lighthouse Performance Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement build-time HTML pre-rendering (SSG) with critical CSS inlining via `critters`, add font preloads, and fix SSR-safety issues — resolving three Lighthouse performance problems.

**Architecture:** Three independent chunks in dependency order: (1) SSR-safety foundation, (2) ssgPlugin core, (3) cleanup and verification. The ssgPlugin runs a second programmatic Rsbuild node-target build after the web build, renders each entry with `react-dom/server`, injects HTML, runs `critters` for critical CSS inlining, then deletes the temp build.

**Tech Stack:** React 19, Rsbuild 1.x (`@rsbuild/core`), `react-dom/server`, `critters`, Vitest + @testing-library/react, TypeScript ESM.

**Spec:** `docs/superpowers/specs/2026-03-15-ssg-lighthouse-design.md`

---

## File Map

| File | Change |
|------|--------|
| `packages/stl/src/lib/window/localStorage.ts` | Return no-op manager instead of throwing in SSR context |
| `packages/stl/src/lib/window/localStorage.test.ts` | Replace throw test with no-op behavior assertions |
| `services/www/src/lib/core/createPage.tsx` | Add `typeof window === 'undefined'` guard |
| `services/www/src/app/index.tsx` | Refactor to named fn + `export default HomePage` |
| `services/www/src/app/articles/index.tsx` | Refactor + `export default` + `toLocaleDateString('en-US', …)` |
| `services/www/src/app/articles/2026/matrix-server-deployment-guide.tsx` | Refactor + `export default` |
| `services/www/src/app/articles/2026/test-article.tsx` | Refactor + `export default` |
| `services/www/src/app/articles/2026/xray-core-subnet-mimicry.tsx` | Refactor + `export default` |
| `packages/rsbuild-config/package.json` | Add `critters`, `react` dependencies |
| `packages/rsbuild-config/src/lib/config/ssg.ts` | Full ssgPlugin implementation |
| `packages/rsbuild-config/src/lib/config/rsbuild.ts` | Add EB Garamond preload; add ssgPlugin to defaults |
| `services/www/package.json` | Remove `simplex-noise`, `suncalc` |

---

## Chunk 1: SSR Safety Foundation

### Task 1: Fix `createLocalStorage` for SSR context

**Files:**
- Modify: `packages/stl/src/lib/window/localStorage.ts`
- Modify: `packages/stl/src/lib/window/localStorage.test.ts`

**Background:** `themeStorage` in `packages/ui/src/lib/theme/storage.ts` is a module-level constant created via `createLocalStorage(...)`. When the SSG node bundle loads, `window` is `undefined` — the current code throws immediately, crashing the SSG render before it starts. Fix: return a safe no-op manager.

- [ ] **Step 1: Update the throw to a no-op manager in `localStorage.ts`**

  In `packages/stl/src/lib/window/localStorage.ts`, replace:
  ```ts
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    throw new Error(
      `[createLocalStorage] Attempted to access storage for key "${key}" outside of a browser environment. ` +
        'This utility is strictly for client-side use.'
    );
  }
  ```
  With:
  ```ts
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return {
      key,
      get: () => defaultValue,
      set: () => {},
      remove: () => {},
    };
  }
  ```

- [ ] **Step 2: Update the test in `localStorage.test.ts`**

  In `packages/stl/src/lib/window/localStorage.test.ts`, replace the test:
  ```ts
  it('should throw if window is undefined', () => {
    vi.stubGlobal('window', undefined);
    expect(() => createLocalStorage(KEY, DEFAULT_VALUE)).toThrow();
  });
  ```
  With:
  ```ts
  it('returns a no-op manager when window is undefined (SSR/SSG context)', () => {
    vi.stubGlobal('window', undefined);
    const manager = createLocalStorage(KEY, DEFAULT_VALUE);
    expect(manager.key).toBe(KEY);
    expect(manager.get()).toEqual(DEFAULT_VALUE);
    expect(() => manager.set({ foo: 'x' })).not.toThrow();
    expect(() => manager.remove()).not.toThrow();
    // get() still returns defaultValue after set (no-op in SSR)
    expect(manager.get()).toEqual(DEFAULT_VALUE);
  });
  ```

- [ ] **Step 3: Run tests to verify they pass**

  ```bash
  pnpm --filter @ermnvldmr/stl test
  ```
  Expected: all tests PASS including the new no-op test.

- [ ] **Step 4: Commit**

  ```bash
  git add packages/stl/src/lib/window/localStorage.ts \
          packages/stl/src/lib/window/localStorage.test.ts
  git commit -m "fix(stl): return SSR-safe no-op manager from createLocalStorage instead of throwing"
  ```

---

### Task 2: Add SSG guard to `createPage`

**Files:**
- Modify: `services/www/src/lib/core/createPage.tsx`

**Background:** When the SSG node bundle loads an entry file, it calls `createPage(Component, options)`. In Node context (no `window`) we must skip the DOM mounting entirely. The component is still exported as `default` for SSG to use.

- [ ] **Step 1: Add guard at top of `createPage` function body**

  In `services/www/src/lib/core/createPage.tsx`, add a guard as the very first line inside `createPage`:
  ```tsx
  export function createPage(Component: React.ComponentType, options: PageOptions = {}): void {
    if (typeof window === 'undefined') return; // SSG build context: skip DOM mounting
    // ... rest of existing code unchanged
  ```

- [ ] **Step 2: Run tests to verify no regression**

  ```bash
  pnpm --filter @ermnvldmr/www test
  ```
  Expected: all tests PASS (no existing tests touch `createPage` directly).

- [ ] **Step 3: Commit**

  ```bash
  git add services/www/src/lib/core/createPage.tsx
  git commit -m "fix(www): skip DOM mounting in createPage when window is undefined (SSG context)"
  ```

---

### Task 3: Refactor entry files — named function + `export default`

**Files:**
- Modify: `services/www/src/app/index.tsx`
- Modify: `services/www/src/app/articles/index.tsx`
- Modify: `services/www/src/app/articles/2026/matrix-server-deployment-guide.tsx`
- Modify: `services/www/src/app/articles/2026/test-article.tsx`
- Modify: `services/www/src/app/articles/2026/xray-core-subnet-mimicry.tsx`

**Background:** The SSG node bundle exposes each entry's component via `require(bundle).default`. Currently all entries pass anonymous/inline functions to `createPage`. Refactor to named function declaration + `export default` so the node bundle's `.default` export is the component.

- [ ] **Step 1: Refactor `src/app/index.tsx`**

  Replace:
  ```tsx
  createPage(
    function HomePage(): React.JSX.Element {
      return (
        <DefaultLayout centerVertically headerAddonLeft={<Header level={3}>{SITE_TITLE}</Header>}>
          {/* ... */}
        </DefaultLayout>
      );
    },
    { title: SITE_TITLE, description: SITE_DESCRIPTION }
  );
  ```
  With:
  ```tsx
  function HomePage(): React.JSX.Element {
    return (
      <DefaultLayout centerVertically headerAddonLeft={<Header level={3}>{SITE_TITLE}</Header>}>
        {/* ... */}
      </DefaultLayout>
    );
  }

  createPage(HomePage, { title: SITE_TITLE, description: SITE_DESCRIPTION });
  export default HomePage;
  ```

- [ ] **Step 2: Refactor `src/app/articles/index.tsx`**

  The only entry that also needs a `toLocaleDateString` locale fix (hydration safety).

  Replace:
  ```tsx
  createPage(
    function ArticlesList(): React.JSX.Element {
      // ...
        subHeadline={article.createdDate.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      // ...
    },
    { title: `Articles | ${SITE_TITLE}`, description: '...' }
  );
  ```
  With:
  ```tsx
  function ArticlesList(): React.JSX.Element {
    // ...
      subHeadline={article.createdDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    // ...
  }

  createPage(ArticlesList, {
    title: `Articles | ${SITE_TITLE}`,
    description: 'Browse all articles and projects.',
  });
  export default ArticlesList;
  ```

  The change from `undefined` → `'en-US'` ensures SSG (Node.js) and browser produce the same date string, avoiding React hydration mismatch warnings.

- [ ] **Step 3: Refactor `src/app/articles/2026/xray-core-subnet-mimicry.tsx`**

  Replace:
  ```tsx
  createPage(
    function XrayCoreSubnetMimicryPage(): React.JSX.Element {
      return (/* ... */);
    },
    {
      title: `${article.title} - Vladimir Eremin`,
      description: article.description,
    }
  );
  ```
  With:
  ```tsx
  function XrayCoreSubnetMimicryPage(): React.JSX.Element {
    return (/* ... */);
  }

  createPage(XrayCoreSubnetMimicryPage, {
    title: `${article.title} - Vladimir Eremin`,
    description: article.description,
  });
  export default XrayCoreSubnetMimicryPage;
  ```

- [ ] **Step 4: Refactor `src/app/articles/2026/matrix-server-deployment-guide.tsx`**

  Same pattern — extract named function, call `createPage`, add `export default`.

- [ ] **Step 5: Refactor `src/app/articles/2026/test-article.tsx`**

  Same pattern.

- [ ] **Step 6: Run linter to verify no issues**

  ```bash
  pnpm --filter @ermnvldmr/www lint
  ```
  Expected: 0 warnings, 0 errors.

- [ ] **Step 7: Commit**

  ```bash
  git add services/www/src/app/index.tsx \
          services/www/src/app/articles/index.tsx \
          services/www/src/app/articles/2026/matrix-server-deployment-guide.tsx \
          services/www/src/app/articles/2026/test-article.tsx \
          services/www/src/app/articles/2026/xray-core-subnet-mimicry.tsx
  git commit -m "feat(www): export page components as default for SSG and fix date locale"
  ```

---

## Chunk 2: ssgPlugin Core

### Task 4: Add dependencies to `rsbuild-config`

**Files:**
- Modify: `packages/rsbuild-config/package.json`

- [ ] **Step 1: Add `critters` and `react` as dependencies**

  ```bash
  cd packages/rsbuild-config
  pnpm add critters react
  ```

  Verify both appear in `packages/rsbuild-config/package.json` under `"dependencies"`.

- [ ] **Step 2: Add type declarations for critters if needed**

  `critters` ships its own types from v0.0.20+. Verify after install:
  ```bash
  node -e "require('critters')" 2>&1 || echo "no types needed"
  ```
  If TypeScript cannot find types, add `@types/critters` or use `// @ts-expect-error` import. In practice `critters` bundles its own `.d.ts`.

- [ ] **Step 3: Commit**

  ```bash
  cd ../..
  git add packages/rsbuild-config/package.json pnpm-lock.yaml
  git commit -m "build(rsbuild-config): add critters and react dependencies for ssgPlugin"
  ```

---

### Task 5: Implement `ssgPlugin`

**Files:**
- Modify: `packages/rsbuild-config/src/lib/config/ssg.ts`

**Background:** Full replacement of the placeholder stub. The plugin runs after the web build, programmatically builds node-target CJS bundles, renders each with `react-dom/server`, injects into the web HTML, runs `critters` for critical CSS inlining, and cleans up.

- [ ] **Step 1: Replace the entire file content**

  Full implementation of `packages/rsbuild-config/src/lib/config/ssg.ts`:

  ```ts
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
                format: 'cjs',
                distPath: { root: ssrDistPath, js: '.' },
                filename: { js: '[name].cjs' },
              },
            },
          });

          await ssrBuild.build();
          console.log('[ssg-plugin] SSR bundles ready.');

          // ── Step 2: Render, inject, inline critical CSS ───────────────────────
          const { renderToString } = await import('react-dom/server');
          const { default: Critters } = await import('critters');

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
  ```

- [ ] **Step 2: Build `rsbuild-config` package to confirm TypeScript compiles**

  ```bash
  pnpm --filter @ermnvldmr/rsbuild-config build
  ```
  Expected: exits 0, no TypeScript errors.

  **If `critters` has no type declarations:** Add `declare module 'critters'` in a local `.d.ts` or use:
  ```ts
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Critters = require('critters') as typeof import('critters').default;
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add packages/rsbuild-config/src/lib/config/ssg.ts
  git commit -m "feat(rsbuild-config): implement ssgPlugin with react-dom/server and critters"
  ```

---

### Task 6: Add EB Garamond preload and activate ssgPlugin in `defineServiceConfig`

**Files:**
- Modify: `packages/rsbuild-config/src/lib/config/rsbuild.ts`

**Background:** Two changes in one file: (1) add `eb-garamond-var.woff2` to the default preload tags — this breaks the CSS→font critical chain. (2) add `ssgPlugin()` to the default plugins array so any service using `defineServiceConfig` gets SSG automatically.

- [ ] **Step 1: Add the EB Garamond preload tag**

  In `packages/rsbuild-config/src/lib/config/rsbuild.ts`, in `defineServiceConfig`, find the `html.tags` array (currently contains two Lato preloads). Add a third tag:

  ```ts
  {
    tag: 'link',
    attrs: {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      href: '/static/font/eb-garamond-var.woff2',
      crossorigin: true,
    },
  },
  ```

  The full `html.tags` array after the change:
  ```ts
  tags: [
    {
      tag: 'link',
      attrs: {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/static/font/lato-400.woff2',
        crossorigin: true,
      },
    },
    {
      tag: 'link',
      attrs: {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/static/font/lato-700.woff2',
        crossorigin: true,
      },
    },
    {
      tag: 'link',
      attrs: {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: '/static/font/eb-garamond-var.woff2',
        crossorigin: true,
      },
    },
  ],
  ```

- [ ] **Step 2: Import and add `ssgPlugin` to the default plugins**

  At the top of the file, add the import:
  ```ts
  import { ssgPlugin } from './ssg.js';
  ```

  In `defineServiceConfig`, change the `plugins` array from:
  ```ts
  plugins: [pluginReact(), pluginTypeCheck()],
  ```
  To:
  ```ts
  plugins: [pluginReact(), pluginTypeCheck(), ssgPlugin()],
  ```

- [ ] **Step 3: Build `rsbuild-config` package to confirm TypeScript compiles**

  ```bash
  pnpm --filter @ermnvldmr/rsbuild-config build
  ```
  Expected: exits 0.

- [ ] **Step 4: Commit**

  ```bash
  git add packages/rsbuild-config/src/lib/config/rsbuild.ts
  git commit -m "feat(rsbuild-config): add EB Garamond preload and activate ssgPlugin in defineServiceConfig"
  ```

---

## Chunk 3: Cleanup & Verification

### Task 7: Remove dead dependencies

**Files:**
- Modify: `services/www/package.json`

**Background:** `simplex-noise` and `suncalc` appear in `services/www/package.json` `dependencies` but are not imported anywhere in the source tree. Removing them reduces lock file noise.

- [ ] **Step 1: Remove unused packages**

  ```bash
  pnpm --filter @ermnvldmr/www remove simplex-noise suncalc
  ```

  Verify they are no longer in `services/www/package.json`.

- [ ] **Step 2: Confirm source tree has no imports**

  ```bash
  rg "simplex-noise|suncalc" services/www/src
  ```
  Expected: no results.

- [ ] **Step 3: Commit**

  ```bash
  git add services/www/package.json pnpm-lock.yaml
  git commit -m "chore(www): remove unused simplex-noise and suncalc dependencies"
  ```

---

### Task 8: Build `ui` and `stl` packages (dependency chain)

The SSG pipeline requires the monorepo packages to be built in order before the www build.

- [ ] **Step 1: Build dependency packages**

  ```bash
  pnpm --filter @ermnvldmr/rsbuild-config build
  pnpm --filter @ermnvldmr/stl build
  pnpm --filter @ermnvldmr/ui build
  ```
  Expected: all exit 0.

---

### Task 9: End-to-end build verification

- [ ] **Step 1: Run the full www build**

  ```bash
  pnpm --filter @ermnvldmr/www build
  ```
  Expected: exits 0. Watch for these log lines indicating SSG ran successfully:
  ```
  [ssg-plugin] Building SSR bundles...
  [ssg-plugin] SSR bundles ready.
  [ssg-plugin] ✓ index
  [ssg-plugin] ✓ articles/index
  [ssg-plugin] ✓ articles/2026/matrix-server-deployment-guide
  [ssg-plugin] ✓ articles/2026/test-article
  [ssg-plugin] ✓ articles/2026/xray-core-subnet-mimicry
  [ssg-plugin] SSG complete. dist-ssr cleaned up.
  ```

- [ ] **Step 2: Verify pre-rendered HTML content in `dist/index.html`**

  ```bash
  grep -c "data-reactroot\|<header\|<main\|<footer" services/www/dist/index.html
  ```
  Expected: count ≥ 1 (pre-rendered React elements are present).

  Also verify the root div is NOT empty:
  ```bash
  grep '<div id="root"></div>' services/www/dist/index.html
  ```
  Expected: no output (root div now contains pre-rendered content).

- [ ] **Step 3: Verify critical CSS was inlined by critters**

  ```bash
  grep -c '<style>' services/www/dist/index.html
  ```
  Expected: ≥ 1 (critters added a `<style>` block with critical CSS).

  ```bash
  grep 'rel="preload".*as="style"' services/www/dist/index.html
  ```
  Expected: matches the main CSS file being preloaded asynchronously.

- [ ] **Step 4: Verify EB Garamond preload is present**

  ```bash
  grep 'eb-garamond-var.woff2' services/www/dist/index.html
  ```
  Expected: a `<link rel="preload" as="font" ...>` tag is found.

- [ ] **Step 5: Verify `dist-ssr/` was cleaned up**

  ```bash
  ls services/www/dist-ssr 2>&1
  ```
  Expected: `No such file or directory` — the temp directory was removed.

- [ ] **Step 6: Smoke-test with Nginx (optional but recommended)**

  ```bash
  cd services/www && pnpm preview
  ```
  Open `http://localhost:4173` in a browser. Expected: page renders immediately with content visible before JavaScript loads (view source should show pre-rendered text). No console errors.

- [ ] **Step 7: Commit**

  ```bash
  git add -A
  git commit -m "feat(www): SSG pipeline, critical CSS inlining, and font preloads complete"
  ```

---

### Task 10: Bundle analysis (informational)

This task produces information for a follow-up iteration on JS splitting. It does not change any production code.

- [ ] **Step 1: Enable bundle analyzer in rsbuild config temporarily**

  Rsbuild supports `performance.bundleAnalyze` to produce a stats report. In `services/www/rsbuild.config.ts`, temporarily add:

  ```ts
  export default defineServiceConfig({
    // ... existing config ...
    performance: {
      bundleAnalyze: {
        analyzerMode: 'static',          // writes bundle-report.html to dist/
        openAnalyzer: false,
        reportFilename: '../bundle-report.html',
      },
    },
  });
  ```

- [ ] **Step 2: Build and open the report**

  ```bash
  pnpm --filter @ermnvldmr/www build
  open services/www/bundle-report.html   # macOS; use xdg-open on Linux
  ```

- [ ] **Step 3: Identify candidates for dynamic imports**

  Look at the chunk containing `js/7341.<hash>.js` (118.9 KiB, 62.6 KiB unused per Lighthouse). Note the top contributing modules. Common candidates:
  - MDX article content bundled into the main chunk
  - Large shared utility packages

  Document findings in `services/www/rsbuild.config.ts` as a comment, or open a follow-up issue. Do not implement JS splitting in this plan.

- [ ] **Step 4: Revert `performance.bundleAnalyze`**

  Remove the `performance.bundleAnalyze` block from `services/www/rsbuild.config.ts` before committing.

---

## Final Verification

- [ ] Run the full test suite:

  ```bash
  pnpm turbo test
  ```
  Expected: all tests pass.

- [ ] Run the www build one final time and confirm SSG log output, pre-rendered HTML, and no `dist-ssr/` leftover:

  ```bash
  pnpm --filter @ermnvldmr/www build 2>&1 | grep '\[ssg-plugin\]'
  grep -c '<style>' services/www/dist/index.html
  grep 'eb-garamond-var' services/www/dist/index.html | head -1
  ls services/www/dist-ssr 2>&1 | grep 'No such file'
  ```

- [ ] Open `services/www/dist/index.html` in a browser (or `pnpm --filter @ermnvldmr/www preview`) and verify: content is visible in page source (pre-rendered), no hydration warnings in console.
