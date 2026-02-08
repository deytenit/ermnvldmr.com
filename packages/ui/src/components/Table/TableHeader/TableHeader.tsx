import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';

/**
 * A wrapper for the table head (thead) element.
 *
 * @param props - Component properties
 * @returns The rendered table head element
 *
 * @example
 * ```tsx
 * <Table.Header>
 *   <Table.Row>
 *     <Table.Head>Header</Table.Head>
 *   </Table.Row>
 * </Table.Header>
 * ```
 */
export const TableHeader = genericMemo(
  forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    function TableHeader({ className, children, ...props }, ref) {
      return (
        <thead {...props} ref={castRef<HTMLTableSectionElement>(ref)} className={cn(className)}>
          {children}
        </thead>
      );
    }
  )
);
