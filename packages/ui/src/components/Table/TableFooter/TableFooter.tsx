import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';

/**
 * A wrapper for the table footer (tfoot) element.
 *
 * @param props - Component properties
 * @returns The rendered table footer element
 *
 * @example
 * ```tsx
 * <Table.Footer>
 *   <Table.Row>
 *     <Table.Cell>Total</Table.Cell>
 *   </Table.Row>
 * </Table.Footer>
 * ```
 */
export const TableFooter = genericMemo(
  forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    function TableFooter({ className, children, ...props }, ref) {
      return (
        <tfoot
          {...props}
          ref={castRef<HTMLTableSectionElement>(ref)}
          className={cn(
            'bg-[var(--rb-muted-base)]/50 font-medium [&>tr]:last:border-b-0',
            className
          )}
        >
          {children}
        </tfoot>
      );
    }
  )
);
