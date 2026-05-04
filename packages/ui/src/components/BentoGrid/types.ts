import React from 'react';

/**
 * Common props for all BentoGrid card variations.
 */
export interface BentoCardBaseProps {
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
