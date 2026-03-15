# Design: Custom SSG Micro-Framework + Lighthouse Performance

**Date:** 2026-03-15
**Status:** Approved — ready for implementation planning

---

## Overview

Three Lighthouse issues deferred from the previous WCAG spec are now addressed together through a single cohesive pipeline: build-time HTML pre-rendering (SSG), critical CSS inlining, and font preloads. A fourth fix removes dead dependencies.

**Lighthouse issues closed by this spec:**
- Render-blocking CSS — est. savings 450 ms
- Network dependency tree latency (652 ms: HTML → CSS → font chain)
- Reduce unused JavaScript — 63 KiB (dead deps + bundle analysis)

---

## Architecture: SSG Build Pipeline

The site is a Rsbuild MPA (multi-entry). Each `src/app/**/*.tsx` file produces one HTML page. Currently those HTML files contain only `<div id="root"/>` — React runs entirely client-side. This spec adds build-time HTML pre-rendering so each page arrives with real content.

### Build flow

```
pnpm build  (rsbuild build)
  └─ web environment  →  dist/
       ├─ index.html                         (<div id="root"/>  — pre-SSG)
       ├─ articles/index.html
       ├─ articles/2026/...html
       ├─ css/6564.<hash>.css                (Tailwind bundle)
       └─ js/...                             (React bundles)

ssgPlugin.onAfterBuild:
  ├─ programmatic 2nd build (node target)  →  dist-ssr/  (temp, never deployed)
  │    ├─ index.cjs
  │    ├─ articles/index.cjs
  │    └─ articles/2026/...cjs
  │
  └─ for each entry:
       1. require(dist-ssr/{entry}.cjs).default  →  Component
       2. renderToString(<Component />)           →  htmlString
       3. inject htmlString into dist/{entry}.html  <div id="root">
       4. critters.process(dist/{entry}.html)    →  inline critical CSS
                                                     + async main stylesheet link
       5. write final dist/{entry}.html
  └─ rm -rf dist-ssr/

Deploy: dist/ → Nginx (unchanged)
```

No Node.js server at runtime. The second build and `renderToString` happen once at build time.

### Why `critters` requires pre-rendered HTML

`critters` extracts CSS rules that match elements present in the HTML. With a pre-rendered page it can identify the real above-fold styles and inline only those, deferring the full Tailwind bundle to load asynchronously. With an empty `<div id="root"/>` it cannot do this — making pre-rendering a prerequisite for effective critical CSS inlining.

After `critters` processes a page the stylesheet loads non-blocking:

```html
<!-- Before critters -->
<link rel="stylesheet" href="/css/6564.css">

<!-- After critters -->
<style>/* inlined critical rules */</style>
<link rel="preload" as="style" href="/css/6564.css"
      onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/css/6564.css"></noscript>
```

---

## 1. `ssgPlugin` Implementation

**File:** `packages/rsbuild-config/src/lib/config/ssg.ts`

Replace the placeholder stub with a full implementation.

### Plugin API

```ts
export function ssgPlugin(): RsbuildPlugin
```

No parameters required. The plugin reads entry/output information from the Rsbuild stats object provided to `onAfterBuild`.

### Implementation steps inside `onAfterBuild`

1. **Collect entry sources and web HTML paths.** Read entry sources from `api.getRsbuildConfig().source?.entry` (the map of entry name → source path produced by `discoverEntries`). Compute each entry's web HTML path as `path.join(api.context.distPath, `${entryName}.html`)` — Rsbuild always outputs `{entryName}.html` regardless of nesting; for example entry `"articles/index"` → `dist/articles/index.html`.

2. **Determine SSR output paths**: same entry names, CJS bundles in a sibling `dist-ssr/` directory: `path.join(ssrDistPath, `${entryName}.cjs`)`.

3. **Programmatic node build** using `createRsbuild` from `@rsbuild/core`:
   ```ts
   import { createRsbuild } from '@rsbuild/core';
   import { pluginReact } from '@rsbuild/plugin-react';

   const ssrBuild = await createRsbuild({
     rsbuildConfig: {
       plugins: [pluginReact()],          // required: JSX transform for .tsx entries
       source: { entry: collectedEntries },
       output: {
         target: 'node',
         format: 'cjs',
         distPath: { root: ssrDistPath, js: '.' },
         filename: { js: '[name].cjs' },
       },
     },
   });
   await ssrBuild.build();
   ```
   Rsbuild with `output.target: 'node'` excludes CSS from the bundle automatically.

4. **For each entry** (clearing Node's module cache between entries):
   ```ts
   import { createRequire } from 'node:module';
   // packages/rsbuild-config is ESM — raw require() unavailable; createRequire shares Node's cache
   const _require = createRequire(import.meta.url);

   // clear cache so re-require loads a fresh module (important if multiple entries share deps)
   delete _require.cache[_require.resolve(ssrBundlePath)];
   const { default: Component } = _require(ssrBundlePath);
   ```

5. **Render** to HTML string:
   ```ts
   const { renderToString } = await import('react-dom/server');
   const html = renderToString(
     React.createElement(React.StrictMode, null, React.createElement(Component))
   );
   ```

6. **Inject** into the web HTML file. Read `dist/{entryName}.html`, replace the root div using a whitespace-tolerant pattern:
   ```ts
   const source = await fs.readFile(webHtmlPath, 'utf8');
   const injected = source.replace(/<div id="root"[^>]*>\s*<\/div>/, `<div id="root">${html}</div>`);
   ```

7. **Run critters** on the injected HTML:
   ```ts
   import Critters from 'critters';
   const critters = new Critters({
     path: webDistPath,
     publicPath: '/',
     preload: 'swap',        // preload + onload + noscript pattern
     inlineFonts: false,     // fonts handled separately via preload tags
     pruneSource: false,     // keep full CSS for post-hydration correctness
   });
   const processed = await critters.process(injected);
   ```

8. **Write** `processed` back to `dist/{entryName}.html`.

9. **Cleanup** `dist-ssr/` after all entries are processed.

### Activation

`ssgPlugin()` is added to the plugins list in `defineServiceConfig`. For now it is always-on for services that import the plugin; services that do not want SSG simply do not include it. `services/www/rsbuild.config.ts` already calls `defineServiceConfig` — no change required to activate SSG at the service level once the plugin is always included in the default plugin list.

Alternatively expose an option: `defineServiceConfig({ ssg: true })`. Either approach is valid; the implementation plan will decide.

---

## 2. Entry File Convention

**Files:** all 5 `services/www/src/app/**/*.tsx` entries.

Each entry must export its component as `default` so the SSR node bundle exposes it via `require(bundle).default`.

```tsx
// Before
createPage(
  function ArticlesList(): React.JSX.Element { … },
  { title: '…', description: '…' }
);

// After
function ArticlesList(): React.JSX.Element { … }

createPage(ArticlesList, { title: '…', description: '…' });
export default ArticlesList;
```

The component name is extracted from the function declaration for stack traces and React DevTools.

---

## 3. `createPage.tsx` SSG Guard

**File:** `services/www/src/lib/core/createPage.tsx`

Add a single guard at the start of the function body:

```ts
export function createPage(Component, options = {}): void {
  if (typeof window === 'undefined') return; // SSG build context: skip mounting
  // … existing code unchanged
}
```

This ensures that when the node bundle loads and executes the entry file, `createPage` is a no-op. The component is still exported as `default` by the entry file (see §2) and is available for `renderToString`.

---

## 4. `createLocalStorage` SSR Safety Fix

**File:** `packages/stl/src/lib/window/localStorage.ts`

**Problem:** `themeStorage` in `packages/ui/src/lib/theme/storage.ts` is a module-level constant created by `createLocalStorage(...)`. `createLocalStorage` currently **throws** when `window` is undefined. When the SSG node bundle loads any component that transitively imports the theme module (e.g. `ThemeSwitch` → `useTheme` → `storage.ts`), the module initialisation throws before any rendering can occur.

**Fix:** Return a safe no-op `StorageManager` instead of throwing:

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

**Impact:** During SSG `renderToString`, `useTheme` reads the no-op manager and returns `defaultValue` (`'system'`). Since the theme class is set on `<html>` by `THEME_INIT_SCRIPT` (already inlined in `<head>`), the pre-rendered HTML has no theme class — this is correct behaviour. Hydration applies the user's actual preference immediately via the existing inline script.

**Other hooks** (`useIntersectionObserver`, `useResizeObserver`, `useScroll`) — all use `useEffect`/`useState` internally. React does not invoke effects during `renderToString`, so these are SSR-safe without changes.

**`createLocalStorage` test update:** The existing `"should throw if window is undefined"` test must be replaced with assertions for no-op behavior: `get()` returns `defaultValue`, `set()` and `remove()` are silent no-ops.

**`toLocaleDateString` hydration safety:** `articles/index.tsx` calls `date.toLocaleDateString(undefined, options)`. Passing `undefined` as locale uses the runtime's default locale — Node.js during SSG and the browser during hydration may produce different strings, causing a hydration mismatch warning. Fix: use a fixed locale (`'en-US'`) on both the server and client side.

---

## 5. Font Preloads

**File:** `packages/rsbuild-config/src/lib/config/rsbuild.ts` (`defineServiceConfig`)

Add `eb-garamond-var.woff2` to the default `html.tags` list alongside the existing Lato preloads:

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

**Why this matters:** The Lighthouse critical path is:
```
HTML (221 ms) → CSS (297 ms) → eb-garamond-var.woff2 (652 ms total)
```
The browser only discovers the font after parsing the CSS `@font-face` block. A `rel="preload"` in `<head>` starts the font download in parallel with CSS, collapsing the sequential chain.

`lato-400.woff2` and `lato-700.woff2` are already preloaded. Italic and Fira Code variants are not on the critical path for any current page.

---

## 6. Dead Dependency Removal

**File:** `services/www/package.json`

Remove `simplex-noise` and `suncalc` — both are listed as `dependencies` but are not imported anywhere in the source tree. They do not contribute to the current bundle (tree-shaking removes unimported packages), but they inflate lock file size and create false expectations.

**Bundle analysis:** After removing dead deps, run `BUNDLE_ANALYZE=true pnpm --filter @ermnvldmr/www build` to inspect the actual composition of `js/7341.<hash>.js` (118.9 KiB, 62.6 KiB unused). Dynamic imports or further splitting may be warranted depending on findings; this is deferred to a follow-up task.

---

## Files Changed

| File | Change |
|------|--------|
| `packages/rsbuild-config/src/lib/config/ssg.ts` | Full `ssgPlugin` implementation |
| `packages/rsbuild-config/src/lib/config/rsbuild.ts` | Add EB Garamond preload; activate `ssgPlugin` |
| `packages/rsbuild-config/package.json` | Add `critters` and `react` dependencies |
| `packages/stl/src/lib/window/localStorage.ts` | Return no-op instead of throw in SSR context |
| `packages/stl/src/lib/window/localStorage.test.ts` | Replace `"should throw if window is undefined"` with no-op behavior assertions |
| `services/www/src/lib/core/createPage.tsx` | Add `typeof window === 'undefined'` guard |
| `services/www/src/app/index.tsx` | Add `export default HomePage` |
| `services/www/src/app/articles/index.tsx` | Add `export default ArticlesList`; fix `toLocaleDateString(undefined, …)` → `toLocaleDateString('en-US', …)` to avoid hydration mismatch |
| `services/www/src/app/articles/2026/matrix-server-deployment-guide.tsx` | Add `export default` |
| `services/www/src/app/articles/2026/test-article.tsx` | Add `export default` |
| `services/www/src/app/articles/2026/xray-core-subnet-mimicry.tsx` | Add `export default` |
| `services/www/package.json` | Remove `simplex-noise`, `suncalc` |

---

## Implementation Order

1. **`createLocalStorage` SSR fix** — unblocks everything else; isolated change, easy to test.
2. **`createPage.tsx` guard** — one line, no tests needed.
3. **Entry files `export default`** — mechanical change to 5 files.
4. **`ssgPlugin` implementation + critters** — core of the work.
5. **Font preload** — one tag in `defineServiceConfig`.
6. **Dead dependency removal** — trivial.

---

## Out of Scope

- SSR (server-side rendering at request time) — this is build-time only.
- Changing the Nginx or Docker deploy configuration.
- React Server Components.
- Detailed JS bundle splitting (deferred pending bundle analysis results).
- Hydration mismatch handling beyond what React 19 provides out of the box.
