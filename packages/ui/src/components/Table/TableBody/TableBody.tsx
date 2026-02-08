import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';

/**
 * A wrapper for the table body (tbody) element.
 *
 * @param props - Component properties
 * @returns The rendered table body element
 *
 * @example
 * ```tsx
 * <Table.Body>
 *   <Table.Row>
 *     <Table.Cell>Data</Table.Cell>
 *   </Table.Row>
 * </Table.Body>
 * ```
 */
export const TableBody = genericMemo(
  forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    function TableBody({ className, children, ...props }, ref) {
      return (
        <tbody {...props} ref={castRef<HTMLTableSectionElement>(ref)} className={cn(className)}>
          {children}
        </tbody>
      );
    }
  )
);
