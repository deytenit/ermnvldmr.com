# WCAG Compliance & UI Fixes Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix WCAG 1.4.4 typography (px → rem + Tailwind @theme tokens), smooth the PageHead collapse animation, and add default content padding in DefaultLayout.

**Architecture:** Three independent tasks in dependency order: (1) typography tokens + Text component, (2) PageHead grid animation, (3) DefaultLayout padding default. Tasks 2 and 3 can be done in any order after task 1 is committed.

**Tech Stack:** React 19, Tailwind CSS v4 (`@theme`, `@layer components`), Rsbuild, Vitest + @testing-library/react.

**Spec:** `docs/superpowers/specs/2026-03-15-wcag-and-ui-fixes-design.md`

---

## File Map

| File | Change |
|------|--------|
| `packages/ui/src/static/styles.css` | Add `@theme` tokens + `@layer components` scale/type classes |
| `packages/ui/src/components/Text/Text.tsx` | Replace `typeStyles` JS map with `text-rb-${type}-${size}` class |
| `packages/ui/src/components/Text/Text.test.tsx` | Add tests for new class name and `font-medium` label behaviour |
| `packages/ui/src/components/Page/PageHead/PageHead.tsx` | Replace `h-0 overflow-hidden` toggle with CSS grid-rows transition |
| `services/www/src/components/Layout/DefaultLayout/DefaultLayout.tsx` | Change `paddingY` default from `'none'` to `'small'` |

**Not touched (inherit changes automatically):**
- `Header.tsx` — maps heading level → `type`/`size` props, passes them to `Text`. No changes needed.
- `Paragraph.tsx`, `Link.tsx` — same pattern.

---

## Chunk 1: Typography System

### Task 1: Add `@theme` tokens to `styles.css`

**File:** `packages/ui/src/static/styles.css`

> No test for CSS tokens — verified visually and via Text component tests in Task 2.

- [ ] **Step 1: Add `@theme` block with all 15 rem-based tokens**

  In `packages/ui/src/static/styles.css`, after the last `@theme` color block (ends around line 184, before `:root`), insert:

  ```css
  @theme {
    /* display */
    --text-rb-display-l: 3.5625rem; --text-rb-display-l--line-height: 4rem;     --text-rb-display-l--letter-spacing: -0.015625rem;
    --text-rb-display-m: 2.8125rem; --text-rb-display-m--line-height: 3.25rem;  --text-rb-display-m--letter-spacing: 0rem;
    --text-rb-display-s: 2.25rem;   --text-rb-display-s--line-height: 2.75rem;  --text-rb-display-s--letter-spacing: 0rem;

    /* headline */
    --text-rb-headline-l: 2rem;     --text-rb-headline-l--line-height: 2.5rem;  --text-rb-headline-l--letter-spacing: 0rem;
    --text-rb-headline-m: 1.75rem;  --text-rb-headline-m--line-height: 2.25rem; --text-rb-headline-m--letter-spacing: 0rem;
    --text-rb-headline-s: 1.5rem;   --text-rb-headline-s--line-height: 2rem;    --text-rb-headline-s--letter-spacing: 0rem;

    /* title */
    --text-rb-title-l: 1.375rem;    --text-rb-title-l--line-height: 1.75rem;  --text-rb-title-l--letter-spacing: 0rem;
    --text-rb-title-m: 1rem;        --text-rb-title-m--line-height: 1.5rem;   --text-rb-title-m--letter-spacing: 0.009375rem;
    --text-rb-title-s: 0.875rem;    --text-rb-title-s--line-height: 1.25rem;  --text-rb-title-s--letter-spacing: 0.00625rem;

    /* body — baseline raised: m = 1rem (was 14px/0.875rem) */
    --text-rb-body-l: 1.125rem;     --text-rb-body-l--line-height: 1.75rem;   --text-rb-body-l--letter-spacing: 0.03125rem;
    --text-rb-body-m: 1rem;         --text-rb-body-m--line-height: 1.5rem;    --text-rb-body-m--letter-spacing: 0.015625rem;
    --text-rb-body-s: 0.875rem;     --text-rb-body-s--line-height: 1.25rem;   --text-rb-body-s--letter-spacing: 0.025rem;

    /* label */
    --text-rb-label-l: 0.875rem;    --text-rb-label-l--line-height: 1.25rem;  --text-rb-label-l--letter-spacing: 0.00625rem;  --text-rb-label-l--font-weight: 500;
    --text-rb-label-m: 0.75rem;     --text-rb-label-m--line-height: 1rem;     --text-rb-label-m--letter-spacing: 0.03125rem;  --text-rb-label-m--font-weight: 500;
    --text-rb-label-s: 0.6875rem;   --text-rb-label-s--line-height: 1rem;     --text-rb-label-s--letter-spacing: 0.03125rem;  --text-rb-label-s--font-weight: 500;
  }
  ```

- [ ] **Step 2: Add `@layer components` scale parents and type children**

  In `packages/ui/src/static/styles.css`, after the `.dark { ... }` block and before `@keyframes shimmer`, insert:

  ```css
  @layer components {
    /* ── Scale parents — set CSS vars for all type children below ── */
    .rb-scale-s {
      --rb-sz-display: var(--text-rb-display-s);   --rb-lh-display: var(--text-rb-display-s--line-height);
      --rb-sz-headline: var(--text-rb-headline-s); --rb-lh-headline: var(--text-rb-headline-s--line-height);
      --rb-sz-title: var(--text-rb-title-s);       --rb-lh-title: var(--text-rb-title-s--line-height);
      --rb-sz-body: var(--text-rb-body-s);         --rb-lh-body: var(--text-rb-body-s--line-height);
      --rb-sz-label: var(--text-rb-label-s);       --rb-lh-label: var(--text-rb-label-s--line-height);
    }
    .rb-scale-m {
      --rb-sz-display: var(--text-rb-display-m);   --rb-lh-display: var(--text-rb-display-m--line-height);
      --rb-sz-headline: var(--text-rb-headline-m); --rb-lh-headline: var(--text-rb-headline-m--line-height);
      --rb-sz-title: var(--text-rb-title-m);       --rb-lh-title: var(--text-rb-title-m--line-height);
      --rb-sz-body: var(--text-rb-body-m);         --rb-lh-body: var(--text-rb-body-m--line-height);
      --rb-sz-label: var(--text-rb-label-m);       --rb-lh-label: var(--text-rb-label-m--line-height);
    }
    .rb-scale-l {
      --rb-sz-display: var(--text-rb-display-l);   --rb-lh-display: var(--text-rb-display-l--line-height);
      --rb-sz-headline: var(--text-rb-headline-l); --rb-lh-headline: var(--text-rb-headline-l--line-height);
      --rb-sz-title: var(--text-rb-title-l);       --rb-lh-title: var(--text-rb-title-l--line-height);
      --rb-sz-body: var(--text-rb-body-l);         --rb-lh-body: var(--text-rb-body-l--line-height);
      --rb-sz-label: var(--text-rb-label-l);       --rb-lh-label: var(--text-rb-label-l--line-height);
    }

    /* ── Type children — declare type, read from parent scale vars ── */
    /* Fallback (second arg to var()) applies m-size when no rb-scale-* parent exists */
    .rb-text-display  { font-family: var(--font-serif); font-size: var(--rb-sz-display,  var(--text-rb-display-m));  line-height: var(--rb-lh-display,  var(--text-rb-display-m--line-height)); }
    .rb-text-headline { font-family: var(--font-serif); font-size: var(--rb-sz-headline, var(--text-rb-headline-m)); line-height: var(--rb-lh-headline, var(--text-rb-headline-m--line-height)); }
    .rb-text-title    { font-family: var(--font-sans);  font-size: var(--rb-sz-title,    var(--text-rb-title-m));    line-height: var(--rb-lh-title,    var(--text-rb-title-m--line-height)); }
    .rb-text-body     { font-family: var(--font-sans);  font-size: var(--rb-sz-body,     var(--text-rb-body-m));     line-height: var(--rb-lh-body,     var(--text-rb-body-m--line-height)); }
    .rb-text-label    { font-family: var(--font-sans);  font-weight: 500; font-size: var(--rb-sz-label, var(--text-rb-label-m)); line-height: var(--rb-lh-label, var(--text-rb-label-m--line-height)); }
  }
  ```

- [ ] **Step 3: Commit CSS changes**

  ```bash
  git add packages/ui/src/static/styles.css
  git commit -m "feat(ui): add @theme typography tokens and rb-scale/rb-text component classes"
  ```

---

### Task 2: Update `Text.tsx`

**File:** `packages/ui/src/components/Text/Text.tsx`

- [ ] **Step 1: Write failing tests for the new class name convention**

  In `packages/ui/src/components/Text/Text.test.tsx`, add at the end of the `describe` block:

  ```tsx
  // TDD: these fail BEFORE implementation (old code uses text-[14px], not text-rb-body-m)
  it('applies text-rb-{type}-{size} class', () => {
    render(<Text type="body" size="m">Content</Text>);
    expect(screen.getByText('Content')).toHaveClass('text-rb-body-m');
  });

  it('does not apply legacy px-based font-size classes', () => {
    render(<Text type="body" size="m">Content</Text>);
    // Old typeStyles map produced these; after refactor they must be gone
    expect(screen.getByText('Content')).not.toHaveClass('text-[14px]');
    expect(screen.getByText('Content')).not.toHaveClass('leading-[20px]');
  });

  // Regression guards: these pass BEFORE and AFTER (font-family/weight already applied)
  it('applies font-medium for label type', () => {
    render(<Text type="label" size="m">Label</Text>);
    expect(screen.getByText('Label')).toHaveClass('font-medium');
  });

  it('applies font-sans for body type', () => {
    render(<Text type="body" size="m">Body</Text>);
    expect(screen.getByText('Body')).toHaveClass('font-sans');
  });

  it('applies font-serif for display type', () => {
    render(<Text type="display" size="l">Display</Text>);
    expect(screen.getByText('Display')).toHaveClass('font-serif');
  });
  ```

- [ ] **Step 2: Run tests to verify the TDD tests fail**

  ```bash
  pnpm --filter @ermnvldmr/ui test
  ```

  Expected: `applies text-rb-{type}-{size} class` and `does not apply legacy px-based font-size classes` FAIL. The three regression guards PASS (that's correct — they already hold).

- [ ] **Step 3: Replace `typeStyles` map in `Text.tsx`**

  In `packages/ui/src/components/Text/Text.tsx`, replace the entire `typeStyles` constant (lines ~129–155) with:

  ```tsx
  const fontFamilyClasses: Record<TextType, string> = {
    display:  'font-serif',
    headline: 'font-serif',
    title:    'font-sans',
    body:     'font-sans',
    label:    'font-sans',
  };
  ```

  Then update the `className` expression inside `cn(...)` — replace `typeStyles[type][size],` with:

  ```tsx
  `text-rb-${type}-${size}`,
  fontFamilyClasses[type],
  type === 'label' && 'font-medium',
  ```

  The full `cn(...)` call should look like:

  ```tsx
  className={cn(
    `text-rb-${type}-${size}`,
    fontFamilyClasses[type],
    type === 'label' && 'font-medium',
    colorClasses[color],
    bold && 'font-bold',
    italic && 'italic',
    underline && 'underline',
    strike && 'line-through',
    align && alignClasses[align],
    wrap && wrapClasses[wrap],
    truncationClass,
    delay !== undefined &&
      (isVisible
        ? 'animate-in fade-in slide-in-from-bottom-2 duration-1000 ease-out'
        : 'opacity-0'),
    className
  )}
  ```

- [ ] **Step 4: Run tests to verify they pass**

  ```bash
  pnpm --filter @ermnvldmr/ui test
  ```

  Expected: all tests PASS, including the 4 new ones.

  > **If `text-rb-body-m` class is not applied in jsdom:** The `@theme` tokens are CSS-only and don't affect class name generation. The class name is computed purely by the template literal — if the test fails, the issue is in the `cn()` call, not the CSS.

- [ ] **Step 5: Commit**

  ```bash
  git add packages/ui/src/components/Text/Text.tsx packages/ui/src/components/Text/Text.test.tsx
  git commit -m "feat(ui): replace typeStyles JS map with @theme token class names in Text"
  ```

---

## Chunk 2: PageHead Smooth Animation

### Task 3: Replace `h-0` toggle with CSS grid-rows transition

**File:** `packages/ui/src/components/Page/PageHead/PageHead.tsx`

The existing `PageHead.test.tsx` should continue to pass without changes — the test checks DOM presence and CSS class on `<header>`, not on the inner content wrappers.

- [ ] **Step 1: Run existing PageHead tests to establish baseline**

  ```bash
  pnpm --filter @ermnvldmr/ui test
  ```

  Expected: all PASS. Note down the count.

- [ ] **Step 2: Replace the two content wrapper `<div>` elements**

  In `packages/ui/src/components/Page/PageHead/PageHead.tsx`, replace the entire `return` block's inner content (keeping `<header ref={headerRef} className={rootClasses}>` and the spacer div unchanged):

  **Before (lines ~126–148):**
  ```tsx
  return (
    <>
      <header ref={headerRef} className={rootClasses}>
        <div
          className={cn('transition-all duration-300', {
            'opacity-0 invisible h-0 overflow-hidden': isCollapsed,
            'opacity-100 visible': !isCollapsed,
          })}
        >
          {expandedContent}
        </div>
        <div
          className={cn('transition-all duration-300', {
            'opacity-100 visible': isCollapsed,
            'opacity-0 invisible h-0 overflow-hidden': !isCollapsed,
          })}
        >
          {collapsedContent}
        </div>
      </header>
      <div style={{ height }} />
    </>
  );
  ```

  **After:**
  ```tsx
  return (
    <>
      <header ref={headerRef} className={rootClasses}>
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-300 ease-in-out',
            isCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
          )}
        >
          <div className="overflow-hidden">{expandedContent}</div>
        </div>
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-300 ease-in-out',
            isCollapsed ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">{collapsedContent}</div>
        </div>
      </header>
      <div style={{ height }} />
    </>
  );
  ```

  Everything else in the file (`rootClasses`, `expandedContent`, `collapsedContent`, `isCollapsed` state, hooks) stays unchanged.

- [ ] **Step 3: Run tests to verify nothing broke**

  ```bash
  pnpm --filter @ermnvldmr/ui test
  ```

  Expected: same number of passing tests as baseline.

- [ ] **Step 4: Verify animation visually**

  Run the www dev server and scroll down to trigger collapse, then back up. The header should smoothly animate height. Both the header itself and the spacer below it should transition without jumping.

  ```bash
  pnpm --filter @ermnvldmr/www dev
  ```

  Open `http://localhost:3000` (or the port printed in output). Navigate to a page that uses `collapsible-sticky` strategy (any page with a `title` in `DefaultLayout`, e.g. `/articles`). Scroll down past 10px, scroll back up.

  If the spacer jumps in any browser: add `transition-[height] duration-300 ease-in-out` to the spacer div and drive its value via a CSS variable.

- [ ] **Step 5: Commit**

  ```bash
  git add packages/ui/src/components/Page/PageHead/PageHead.tsx
  git commit -m "fix(ui): smooth PageHead collapse using CSS grid-rows transition"
  ```

---

## Chunk 3: Content Padding

### Task 4: Change `paddingY` default in `DefaultLayout`

**File:** `services/www/src/components/Layout/DefaultLayout/DefaultLayout.tsx`

- [ ] **Step 1: Change the default value**

  In `DefaultLayout.tsx`, find the destructured prop default:

  ```tsx
  paddingY = 'none',
  ```

  Change to:

  ```tsx
  paddingY = 'small',
  ```

  Also update the JSDoc comment on the prop (line ~31):
  ```tsx
  /**
   * Vertical padding scale.
   * @default 'small'
   */
  paddingY?: PagePadding;
  ```

- [ ] **Step 2: Check for callers that relied on the old default**

  Search the `services/www/src` directory for uses of `DefaultLayout` that do NOT pass `paddingY`:

  ```bash
  rg "DefaultLayout" services/www/src --type tsx -l
  ```

  For each found file, open it and verify that `paddingY="small"` (1rem top/bottom on mobile, 1.5rem on sm+) looks correct for that page. If any page genuinely needs no padding, add `paddingY="none"` explicitly to that call.

- [ ] **Step 3: Commit**

  ```bash
  git add services/www/src/components/Layout/DefaultLayout/DefaultLayout.tsx
  git commit -m "fix(www): add default vertical padding to DefaultLayout content area"
  ```

---

## Final Verification

- [ ] Run full test suite:

  ```bash
  pnpm turbo test
  ```

  Expected: all tests pass.

- [ ] Open the site in a browser, resize viewport from desktop → narrow → mobile. Verify content has consistent breathing room around the PageHead.

- [ ] Scroll on a page with `collapsible-sticky` strategy. Verify PageHead collapses and expands smoothly with no layout jump.

- [ ] Open browser DevTools, inspect a `<Text type="body" size="m">` element. Verify `font-size` is `1rem` (not `14px`) — confirming WCAG 1.4.4 fix.
