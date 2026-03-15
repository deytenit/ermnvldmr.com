# Design: WCAG Compliance & UI Fixes

**Date:** 2026-03-15
**Status:** Approved — ready for implementation planning

---

## Overview

Four independent improvements targeting WCAG compliance, mobile usability, animation quality, and Lighthouse performance.

---

## 1. Typography System Redesign

### Problem

- All font sizes in `Text.tsx` are hardcoded in `px` (`text-[14px]`), which fails WCAG 1.4.4 (Resize Text) — px values do not respect browser base font-size settings.
- The default body text (`body.m`) is 14px, below the recommended 16px minimum for readability.
- Typography logic lives in JS (`typeStyles` map), making it impossible to apply type styles outside the `Text` component without duplicating values.

### Solution: Hybrid `@theme` tokens + CSS cascade (Approach C)

#### Architecture

Two layers, one source of truth:

1. **`@theme` tokens in `styles.css`** — 15 rem-based tokens (5 types × 3 sizes). Each token includes `font-size`, `line-height`, `letter-spacing`, and `font-weight` (where applicable) via Tailwind v4's `--text-{name}--*` companion variables. This produces direct Tailwind utilities like `text-rb-body-m`.

2. **`@layer components`** — Two sets of classes:
   - **Scale parents** (`.rb-scale-s/m/l`) — set CSS custom properties per type for children to inherit.
   - **Type children** (`.rb-text-body`, `.rb-text-title`, etc.) — read scale vars with fallback to `m` size when no parent is present. Include `font-family` (which `@theme` cannot express).

#### Token Table

All values in `rem`. Base: `1rem = 16px` (browser default).

| Type      | `s`         | `m`        | `l`          | Font family |
|-----------|-------------|------------|--------------|-------------|
| display   | 2.25rem (36px) | 2.8125rem (45px) | 3.5625rem (57px) | serif |
| headline  | 1.5rem (24px)  | 1.75rem (28px)   | 2rem (32px)      | serif |
| title     | 0.875rem (14px) | 1rem (16px)     | 1.375rem (22px)  | sans  |
| body      | 0.875rem (14px) | **1rem (16px)**  | 1.125rem (18px)  | sans  |
| label     | 0.6875rem (11px) | 0.75rem (12px)  | 0.875rem (14px)  | sans, weight 500 |

> **Key change:** `body.m` increases from 14px → 16px (1rem). `body.s` stays at 14px. All other sizes shift proportionally.

#### CSS Classes

```css
/* styles.css */
@theme {
  --text-rb-display-l: 3.5625rem; --text-rb-display-l--line-height: 4rem;     --text-rb-display-l--letter-spacing: -0.015625rem;
  --text-rb-display-m: 2.8125rem; --text-rb-display-m--line-height: 3.25rem;  --text-rb-display-m--letter-spacing: 0;
  --text-rb-display-s: 2.25rem;   --text-rb-display-s--line-height: 2.75rem;  --text-rb-display-s--letter-spacing: 0;

  --text-rb-headline-l: 2rem;     --text-rb-headline-l--line-height: 2.5rem;
  --text-rb-headline-m: 1.75rem;  --text-rb-headline-m--line-height: 2.25rem;
  --text-rb-headline-s: 1.5rem;   --text-rb-headline-s--line-height: 2rem;

  --text-rb-title-l: 1.375rem;    --text-rb-title-l--line-height: 1.75rem;  --text-rb-title-l--letter-spacing: 0;
  --text-rb-title-m: 1rem;        --text-rb-title-m--line-height: 1.5rem;   --text-rb-title-m--letter-spacing: 0.009375rem;
  --text-rb-title-s: 0.875rem;    --text-rb-title-s--line-height: 1.25rem;  --text-rb-title-s--letter-spacing: 0.00625rem;

  --text-rb-body-l: 1.125rem;     --text-rb-body-l--line-height: 1.75rem;   --text-rb-body-l--letter-spacing: 0.03125rem;
  --text-rb-body-m: 1rem;         --text-rb-body-m--line-height: 1.5rem;    --text-rb-body-m--letter-spacing: 0.015625rem;
  --text-rb-body-s: 0.875rem;     --text-rb-body-s--line-height: 1.25rem;   --text-rb-body-s--letter-spacing: 0.025rem;

  --text-rb-label-l: 0.875rem;    --text-rb-label-l--line-height: 1.25rem;  --text-rb-label-l--letter-spacing: 0.00625rem;  --text-rb-label-l--font-weight: 500;
  --text-rb-label-m: 0.75rem;     --text-rb-label-m--line-height: 1rem;     --text-rb-label-m--letter-spacing: 0.03125rem;  --text-rb-label-m--font-weight: 500;
  --text-rb-label-s: 0.6875rem;   --text-rb-label-s--line-height: 1rem;     --text-rb-label-s--letter-spacing: 0.03125rem;  --text-rb-label-s--font-weight: 500;
}

@layer components {
  /* Scale parents */
  .rb-scale-s {
    --rb-sz-display: var(--text-rb-display-s);  --rb-lh-display: var(--text-rb-display-s--line-height);
    --rb-sz-headline: var(--text-rb-headline-s); --rb-lh-headline: var(--text-rb-headline-s--line-height);
    --rb-sz-title: var(--text-rb-title-s);       --rb-lh-title: var(--text-rb-title-s--line-height);
    --rb-sz-body: var(--text-rb-body-s);         --rb-lh-body: var(--text-rb-body-s--line-height);
    --rb-sz-label: var(--text-rb-label-s);       --rb-lh-label: var(--text-rb-label-s--line-height);
  }
  .rb-scale-m {
    --rb-sz-display: var(--text-rb-display-m);  --rb-lh-display: var(--text-rb-display-m--line-height);
    --rb-sz-headline: var(--text-rb-headline-m); --rb-lh-headline: var(--text-rb-headline-m--line-height);
    --rb-sz-title: var(--text-rb-title-m);       --rb-lh-title: var(--text-rb-title-m--line-height);
    --rb-sz-body: var(--text-rb-body-m);         --rb-lh-body: var(--text-rb-body-m--line-height);
    --rb-sz-label: var(--text-rb-label-m);       --rb-lh-label: var(--text-rb-label-m--line-height);
  }
  .rb-scale-l {
    --rb-sz-display: var(--text-rb-display-l);  --rb-lh-display: var(--text-rb-display-l--line-height);
    --rb-sz-headline: var(--text-rb-headline-l); --rb-lh-headline: var(--text-rb-headline-l--line-height);
    --rb-sz-title: var(--text-rb-title-l);       --rb-lh-title: var(--text-rb-title-l--line-height);
    --rb-sz-body: var(--text-rb-body-l);         --rb-lh-body: var(--text-rb-body-l--line-height);
    --rb-sz-label: var(--text-rb-label-l);       --rb-lh-label: var(--text-rb-label-l--line-height);
  }

  /* Type children — fallback to m-size when no rb-scale-* parent */
  .rb-text-display  { font-family: var(--font-serif); font-size: var(--rb-sz-display,  var(--text-rb-display-m));  line-height: var(--rb-lh-display,  var(--text-rb-display-m--line-height)); }
  .rb-text-headline { font-family: var(--font-serif); font-size: var(--rb-sz-headline, var(--text-rb-headline-m)); line-height: var(--rb-lh-headline, var(--text-rb-headline-m--line-height)); }
  .rb-text-title    { font-family: var(--font-sans);  font-size: var(--rb-sz-title,    var(--text-rb-title-m));    line-height: var(--rb-lh-title,    var(--text-rb-title-m--line-height)); }
  .rb-text-body     { font-family: var(--font-sans);  font-size: var(--rb-sz-body,     var(--text-rb-body-m));     line-height: var(--rb-lh-body,     var(--text-rb-body-m--line-height)); }
  .rb-text-label    { font-family: var(--font-sans);  font-size: var(--rb-sz-label,    var(--text-rb-label-m));    line-height: var(--rb-lh-label,     var(--text-rb-label-m--line-height)); font-weight: 500; }
}
```

#### Usage patterns

```tsx
// Pattern 1: Direct Tailwind utility (explicit size)
<p className="text-rb-body-m font-sans">Body text at m size</p>

// Pattern 2: Scale cascade (parent sets density, children auto-harmonise)
<div className="rb-scale-l">
  <h2 className="rb-text-headline">Heading</h2>
  <span className="rb-text-label">Published 2026-03-15</span>
</div>

// Pattern 3: Text component (unchanged API)
<Text type="body" size="m">Body text</Text>
```

#### `Text.tsx` changes

Replace the `typeStyles` JS map with a single class expression and a `fontFamilyClasses` lookup:

```tsx
const fontFamilyClasses: Record<TextType, string> = {
  display:  'font-serif',
  headline: 'font-serif',
  title:    'font-sans',
  body:     'font-sans',
  label:    'font-sans',
};

// className generation (replaces typeStyles[type][size])
cn(
  `text-rb-${type}-${size}`,  // Tailwind utility from @theme (size + line-height)
  fontFamilyClasses[type],    // font-family not carried by @theme tokens
  type === 'label' && 'font-medium',  // @theme font-weight companion may not apply
  colorClasses[color],
  // ... rest unchanged
)
```

> **Implementation note — letter-spacing:** Tailwind v4's `--text-{name}--letter-spacing` companion is documented but browser/tooling support should be confirmed. During implementation, verify that `text-rb-body-m` applies tracking correctly. If not, add an explicit `tracking-[<value>]` utility per size, or define a `trackingClasses` map analogous to `fontFamilyClasses`.
>
> **Implementation note — label font-weight:** `--text-rb-label-*--font-weight: 500` is defined in `@theme` but the Tailwind utility may not honour the `font-weight` companion. The explicit `type === 'label' && 'font-medium'` guard ensures it is always applied.

#### WCAG compliance

- All values in `rem` → WCAG 1.4.4 (Resize Text, Level AA) satisfied via technique C14.
- `body.m` baseline raised to `1rem` (16px) for improved readability.
- No `px` or `vw/vh` units in font-size → no WCAG 1.4.4 failures (F94).

#### Files to change

- `packages/ui/src/static/styles.css` — add `@theme` tokens + `@layer components` classes
- `packages/ui/src/components/Text/Text.tsx` — replace `typeStyles` map
- `packages/ui/src/components/Text/Text.test.tsx` — update class name assertions

---

## 2. Mobile Top Padding

### Problem

On mobile viewports, page content begins immediately after the PageHead spacer with no breathing room. On desktop, `centerVertically` naturally creates visual space; on mobile the shorter viewport eliminates this effect.

### Solution

Wrap `PageContainer` children in an inner div with `pt-6 sm:pt-0`. This is **additive** — it does not conflict with `paddingY` (which controls the outer container's `py-*`), but adds breathing room between the PageHead spacer and the visible content on mobile.

```tsx
<PageContainer
  as="main"
  centerVertically={centerVertically}
  paddingY={paddingY}
  width={width}
>
  <div className="pt-6 sm:pt-0">
    {children}
  </div>
</PageContainer>
```

`pt-6` = `1.5rem` — enough breathing room without disrupting vertical centering on tablet/desktop. The inner div approach ensures extra top space is always additive regardless of `paddingY` value.

> **Alternative considered:** conditionally applying `className="max-sm:pt-6"` on the PageContainer directly only when `paddingY === 'none'`. Rejected because it couples layout logic to a specific prop value and would silently fail for other `paddingY` settings.

#### Files to change

- `services/www/src/components/Layout/DefaultLayout/DefaultLayout.tsx`

---

## 3. PageHead Smooth Collapse Animation

### Problem

`PageHead` switches between expanded and collapsed states by toggling `h-0 overflow-hidden`. CSS cannot animate `height: auto → height: 0`, so the layout jumps instantly even though `transition-all duration-300` is present.

### Solution: CSS `grid-template-rows` transition

The `grid-rows-[0fr] → grid-rows-[1fr]` pattern is the modern standard for animating unknown element heights. No JS height measurement, no `max-height` guessing.

```tsx
{/* Expanded content — animates height in/out */}
<div
  className={cn(
    'grid transition-[grid-template-rows] duration-300 ease-in-out',
    isCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
  )}
>
  <div className="overflow-hidden">{expandedContent}</div>
</div>

{/* Collapsed content — same pattern, inverted */}
<div
  className={cn(
    'grid transition-[grid-template-rows] duration-300 ease-in-out',
    isCollapsed ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
  )}
>
  <div className="overflow-hidden">{collapsedContent}</div>
</div>
```

**Why the spacer tracks the animation:** `useResizeObserver` fires when layout changes. During a CSS `grid-template-rows` transition the browser continuously re-lays out the grid, causing the ResizeObserver to fire on each layout recalc and update `<div style={{ height }}/>` incrementally. This is the expected behavior in Chrome, Firefox, and Safari.

> **Implementation note:** Confirm smooth spacer animation during implementation. If the spacer still jumps (e.g. in a specific browser), the fallback is to animate the spacer height with a matching CSS transition: `transition-[height] duration-300 ease-in-out` using a CSS variable set by a JS `style` attribute updated in sync.

Remove `opacity-0 invisible h-0 overflow-hidden` toggle logic. Keep existing `isCollapsed` state and `useScroll`/`useResizeObserver` hooks unchanged.

#### Files to change

- `packages/ui/src/components/Page/PageHead/PageHead.tsx`

---

## 4. Lighthouse Performance

### 4a. Font preload (Quick win — Est. −200ms critical path)

`eb-garamond-var.woff2` (41 KiB) is discovered only after CSS is parsed — it sits 431ms into the critical path. Add a `<link rel="preload">` in the shared rsbuild config alongside the existing Lato preloads:

```ts
// packages/rsbuild-config/src/lib/config/rsbuild.ts  (shared default config)
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

Also add preload for the italic variant if used above-the-fold.

> **Implementation note:** `mergeConfig` concatenates `html.tags` arrays, so the new preload belongs in `packages/rsbuild-config/src/lib/config/rsbuild.ts` (shared defaults) — not in `services/www/rsbuild.config.ts`. Confirm after build that the preload `href` (`/static/font/eb-garamond-var.woff2`) matches the final output path from the `output.distPath.font` config.

#### Files to change

- `packages/rsbuild-config/src/lib/config/rsbuild.ts`

---

### 4b. Render-blocking CSS (Research task — Est. −450ms)

The main CSS chunk `6564.34a45870.css` blocks first render. Full solution requires critical CSS extraction (inline above-the-fold styles, defer the rest).

**Candidates to evaluate:**
- `@rsbuild/plugin-inline-chunk` — inlines entire small chunks; usable if CSS can be split into critical/non-critical files.
- `critters` — extracts and inlines critical CSS per route. Requires Rspack/Rsbuild compatibility check.
- Manual split via `html.tags` — extract reset + base styles (`@layer base`) into a dedicated inline `<style>` tag in `rsbuild.config.ts`; load component styles async.

**Scope:** This is a research and implementation task to follow separately. Not a blocker for other fixes.

---

### 4c. Reduce unused JavaScript (Minor — Est. −63 KiB)

`7341.6b80d938.js` contains ~62.6 KiB of unused code (likely a shared vendor/route chunk).

**Step 1:** Add `@rsbuild/plugin-bundle-analyzer` to identify what's in the chunk.
**Step 2:** Based on analysis — apply dynamic imports for non-critical paths or refine chunk splitting config.

**Scope:** Separate task after bundle analysis.

---

## Implementation Order

1. **Typography system** — highest impact, touches `packages/ui` (affects all services).
2. **PageHead animation** — isolated, single file change.
3. **Mobile padding** — trivial, single className addition.
4. **Lighthouse: font preload** — quick win in rsbuild config.
5. **Lighthouse: CSS blocking + unused JS** — research tasks, separate scope.

---

## Out of Scope

- Changes to component API (`Text`, `PageHead`, `DefaultLayout` props remain backward-compatible).
- Modifying other Lighthouse metrics not mentioned (LCP, CLS, TBT).
- Typography for `Header` component — it wraps `Text`, will inherit changes automatically.
