import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';

import { paddingClasses, borderClasses } from '../constants';
import { useTableContext } from '../contexts/TableContext/TableContext';
import { useTableRowContext } from '../contexts/TableRowContext/TableRowContext';

import type { TablePadding, TableCellBorder } from '../types';

/**
 * Props for the TableHead component.
 */
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Padding override for the cell */
  padding?: TablePadding;
  /** Text alignment override */
  align?: 'left' | 'center' | 'right';
  /**
   * Border configuration for the cell.
   * If not provided, defaults to 'all' if Table grid is enabled,
   * or 'bottom' unless the row/table is ghost.
   */
  border?: TableCellBorder;
}

/**
 * A table header cell (th) with density and alignment control.
 *
 * @param props - Component properties
 * @returns The rendered table header element
 *
 * @example
 * ```tsx
 * <Table.Head>Invoice Number</Table.Head>
 * ```
 */
export const TableHead = genericMemo(
  forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
    { className, children, padding, align = 'left', border, ...props },
    ref
  ) {
    const { density, grid } = useTableContext();
    const { noBorder } = useTableRowContext();
    const finalPadding = padding ?? density;

    // Resolve the border to apply
    let resolvedBorder: TableCellBorder;
    if (border) {
      resolvedBorder = border;
    } else if (grid) {
      resolvedBorder = 'all';
    } else if (noBorder) {
      resolvedBorder = 'none';
    } else {
      resolvedBorder = 'bottom';
    }

    return (
      <th
        {...props}
        ref={castRef<HTMLTableCellElement>(ref)}
        className={cn(
          'align-middle font-medium text-[var(--rb-muted-text)]',
          paddingClasses[finalPadding],
          borderClasses[resolvedBorder],
          align === 'left' && 'text-left',
          align === 'center' && 'text-center',
          align === 'right' && 'text-right',
          className
        )}
      >
        {children}
      </th>
    );
  })
);
