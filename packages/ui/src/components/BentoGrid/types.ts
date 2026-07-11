import type React from 'react';

/**
 * Common props for all BentoGrid card variations.
 *
 * Typed against `HTMLElement` since a card can render as either a `div` or,
 * when `href` is provided, an `a`.
 */
export interface BentoCardBaseProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Number of columns to span on medium screens and up.
   * @default 1
   */
  colSpan?: 1 | 2 | 3 | 4;
  /**
   * Number of rows to span on medium screens and up.
   * @default 1
   */
  rowSpan?: 1 | 2 | 3;
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * The content of the card.
   */
  children?: React.ReactNode;
  /**
   * If provided, the card renders as an anchor (`<a>`) so the entire card is a
   * navigable link. Card styling and colSpan/rowSpan are preserved.
   */
  href?: string;
}

/**
 * Props for the root BentoGrid component.
 */
export interface BentoGridProps {
  /**
   * The cards to display in the grid.
   */
  children: React.ReactNode;
  /**
   * Additional CSS classes.
   */
  className?: string;
}
