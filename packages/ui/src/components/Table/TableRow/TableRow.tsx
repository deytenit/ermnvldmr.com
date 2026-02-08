import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';

import { useTableContext } from '../contexts/TableContext/TableContext';
import { TableRowContext } from '../contexts/TableRowContext/TableRowContext';

/**
 * Props for the TableRow component.
 */
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /**
   * Removes the bottom border.
   * @default false
   */
  noBorder?: boolean;
  /**
   * Overrides global hover state.
   * If not provided, inherits from Table context.
   */
  hoverable?: boolean;
  /**
   * Forces selected/highlighted state.
   * @default false
   */
  selected?: boolean;
}

/**
 * A table row component (tr) with hover, stripe, and border controls.
 *
 * @param props - Component properties
 * @returns The rendered table row element
 *
 * @example
 * ```tsx
 * <Table.Row selected hoverable>
 *   <Table.Cell>Row Data</Table.Cell>
 * </Table.Row>
 * ```
 */
export const TableRow = genericMemo(
  forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
    { className, children, noBorder, hoverable, selected, ...props },
    ref
  ) {
    const context = useTableContext();
    const isHoverable = hoverable ?? context.hoverable;
    const isNoBorder = noBorder ?? context.variant === 'ghost';

    return (
      <TableRowContext.Provider value={{ noBorder: isNoBorder }}>
        <tr
          {...props}
          ref={castRef<HTMLTableRowElement>(ref)}
          className={cn(
            'transition-colors',
            isHoverable && 'hover:bg-[var(--rb-muted-base)]/50',
            context.striped && 'even:bg-[var(--rb-muted-base)]/20',
            selected && 'bg-[var(--rb-muted-base)]',
            className
          )}
        >
          {children}
        </tr>
      </TableRowContext.Provider>
    );
  })
);
