import { cn } from '@ermnvldmr/stl';
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
  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row w-full',
        {
          [`gap-${gap}`]: typeof gap === 'number',
          [String(gap)]: typeof gap === 'string',
        },
        className
      )}
    >
      {children}
    </div>
  );
};
