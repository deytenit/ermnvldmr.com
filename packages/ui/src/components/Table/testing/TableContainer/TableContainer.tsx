import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';

/**
 * Props for the TableContainer component.
 */
export interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant of the container.
   * If 'ghost', the outer border is removed.
   * @default 'surface'
   */
  variant?: 'surface' | 'ghost';
}

/**
 * A responsive wrapper for the Table component.
 * Handles horizontal scrolling, outer borders, and accessibility for scrollable regions.
 *
 * @param props - Component properties
 * @returns The rendered container element
 *
 * @example
 * ```tsx
 * <TableContainer>
 *   <Table>...</Table>
 * </TableContainer>
 * ```
 */
export const TableContainer = genericMemo(
  forwardRef<HTMLDivElement, TableContainerProps>(function TableContainer(
    { className, children, variant = 'surface', ...props },
    ref
  ) {
    return (
      <div
        {...props}
        ref={castRef<HTMLDivElement>(ref)}
        className={cn(
          'w-full overflow-auto rounded-md',
          variant !== 'ghost' && 'border border-[var(--rb-border)]',
          className
        )}
        role="region"
        tabIndex={0}
      >
        {children}
      </div>
    );
  })
);
