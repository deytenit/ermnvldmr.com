import { cn } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import React from 'react';

/**
 * Props for the PageColumns component.
 */
export interface PageColumnsProps {
  /** The columns to be displayed within the grid. */
  children: React.ReactNode;
  /**
   * Spacing between columns.
   * @default 6
   */
  gap?: number | string;
  /**
   * Optional additional class names.
   */
  className?: string;
}

const pageColumnsVariants = cva('flex flex-col lg:flex-row w-full');

/**
 /**
 * Host component for a responsive column system.
 * It handles the flex/grid layout for page columns.
 *
 * @param props - The component props.
 * @returns A PageColumns component.
 * @example
 * ```tsx
 * <PageColumns gap={8}>
 *   <PageColumn size="small">Sidebar</PageColumn>
 *   <PageColumn size="full">Main Content</PageColumn>
 * </PageColumns>
 * ```
 */
export const PageColumns = ({ children, gap = 6, className }: PageColumnsProps) => {
  // `gap` accepts either a Tailwind spacing-scale number (`gap-N`) or an
  // arbitrary class string, so the value space is not enumerable as a cva
  // variant. Compute the numeric class here and pass strings through verbatim.
  const gapClass = typeof gap === 'number' ? `gap-${gap}` : gap;

  return (
    <div className={cn(pageColumnsVariants(), gapClass, className)}>{children}</div>
  );
};
