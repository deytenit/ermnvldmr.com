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

## 2. Content Top Padding

### Problem

When the viewport is narrow (mobile or squeezed desktop), page content begins immediately after the PageHead spacer with no breathing room. The issue is not mobile-only — it appears whenever the viewport is short enough that `centerVertically` does not create natural spacing.

### Solution

Change the default `paddingY` in `DefaultLayout` from `'none'` to `'small'`. `paddingY="small"` maps to `py-4 sm:py-6` in `PageContainer`, which adds consistent vertical breathing room at all viewport sizes without any custom class.

```tsx
// DefaultLayout.tsx — change default
paddingY = 'small',  // was 'none'
```

Pages that genuinely need no vertical padding (if any) can still override by passing `paddingY="none"` explicitly.

#### Files to change

- `services/www/src/components/Layout/DefaultLayout/DefaultLayout.tsx`

---

## 3. PageHead Smooth Collapse Animation

### Problem

`PageHead` switches between expanded and collapsed states by toggling `h-0 overflow-hidden`. CSS cannot animate `height: auto → height: 0`, so the layout jumps instantly even though `transition-all duration-300` is present.

### Solution: CSS `grid-template-rows` transition

The `grid-rows-[0fr] → grid-rows-[1fr]` pattern is the modern standard for animating unknown element heights. No JS height measurement, no `max-height` guessing.

**Only the expand/collapse mechanism changes.** Visual design, layout, padding, shadow, backdrop — all remain exactly as they are.

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

Replace `opacity-0 invisible h-0 overflow-hidden` toggle logic with the grid wrappers above. Keep `isCollapsed` state, `useScroll`, `useResizeObserver`, existing `rootClasses`, `expandedContent`, and `collapsedContent` definitions unchanged.

**Why the spacer tracks the animation:** During a CSS `grid-template-rows` transition the browser continuously re-lays out the grid, causing `useResizeObserver` to fire on each layout recalculation and update `<div style={{ height }}/>` incrementally. This is expected behavior in Chrome, Firefox, and Safari.

> **Implementation note:** Confirm smooth spacer animation in all browsers. If the spacer jumps in a specific browser, apply a matching `transition-[height] duration-300 ease-in-out` to the spacer div via a CSS variable updated in JS.

#### Files to change

- `packages/ui/src/components/Page/PageHead/PageHead.tsx`

---

## 4. Lighthouse Performance

**Out of scope for this iteration.** Lighthouse improvements (render-blocking CSS, font critical path, unused JS) require dedicated research and have more complex trade-offs. Deferred to a separate spec.

---

## Implementation Order

1. **Typography system** — highest impact, touches `packages/ui` (affects all services).
2. **PageHead animation** — isolated, single file change.
3. **Content padding** — trivial, single default prop change.

---

## Out of Scope

- Changes to component API (`Text`, `PageHead`, `DefaultLayout` props remain backward-compatible).
- Modifying other Lighthouse metrics not mentioned (LCP, CLS, TBT).
- Typography for `Header` component — it wraps `Text`, will inherit changes automatically.
