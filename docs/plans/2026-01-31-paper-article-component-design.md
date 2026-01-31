# Design Plan: PaperArticle Component & Interactive Container

**Date:** 2026-01-31
**Status:** Approved

## Overview
This plan outlines the implementation of the `PaperArticle` component within the `paper` component set and the enhancement of the generic `Container` component to support interactivity.

## 1. Interactive Container Enhancement
Enhance `packages/ui/src/components/generic/Container` to support press interactions.

### Changes
- **Prop Expansion:** Add `onPress?: (e: PressEvent) => void` to `ContainerProps`.
- **Interactivity:** Integrate `usePress` from `react-aria`.
- **Ref Handling:** Use `useRef` for the underlying `div` to support `usePress`.
- **Visual Feedback:** 
    - Add `cursor-pointer` when `onPress` is present.
    - Add a subtle active state (e.g., `active:opacity-80`) for immediate haptic/visual feedback.
- **Accessibility:** `usePress` handles keyboard interactions (Enter/Space) and ARIA attributes automatically.

## 2. PaperArticle Component
A specialized layout component for newspaper-style articles.

### Location
`packages/ui/src/components/paper/PaperArticle/PaperArticle.tsx`

### Props
- `headline` (string): The main article title.
- `subHeadline` (string, optional): Italicized label text between separators.
- `additionalText` (string, optional): Small, muted, italicized text at the bottom.
- `onPress` (handler, optional): Propagated to the wrapping `Container`.
- `children` (ReactNode): The main body content.

### Layout (VStack)
1.  **Header:** `level={4}` (headline-m), centered.
2.  **Separator:** `PaperSeparator` (type: single).
3.  **Sub-headline (if present):** `Text` (type: label, size: m, italic: true), centered.
4.  **Separator (if sub-headline present):** `PaperSeparator` (type: single).
5.  **Main Body:** `Text` (type: body, size: m) wrapping `children`.
6.  **Additional Text (if present):** `Text` (type: label, size: s, italic: true, color: muted).

## 3. Implementation Steps
1.  **Modify `Container`**: Add `react-aria` hooks and `onPress` logic.
2.  **Create `PaperArticle`**: Implement the structured layout.
3.  **Export**: Update `packages/ui/src/components/paper/index.ts` and `packages/ui/src/index.ts`.
4.  **Verify**: Add Storybook stories for `PaperArticle` and interactive `Container` states.
