import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import React, { forwardRef } from 'react';

import { paddingClasses, borderClasses } from '../constants';
import { useTableContext } from '../contexts/TableContext/TableContext';
import { useTableRowContext } from '../contexts/TableRowContext/TableRowContext';

import type { TablePadding, TableCellBorder } from '../types';

/**
 * Props for the TableCell component.
 */
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
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

const cellVariants = cva('align-middle', {
  variants: {
    padding: paddingClasses,
    border: borderClasses,
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
});

/**
 * A standard table data cell (td) with density and alignment control.
 *
 * @param props - Component properties
 * @returns The rendered table cell element
 *
 * @example
 * ```tsx
 * <Table.Cell align="right">1,234.56</Table.Cell>
 * ```
 *
 * @example
 * ```tsx
 * <Table.Cell border="all">Bordered Cell</Table.Cell>
 * ```
 */
export const TableCell = genericMemo(
  forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
    { className, children, padding, align, border, ...props },
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
      <td
        {...props}
        ref={castRef<HTMLTableCellElement>(ref)}
        className={cn(
          cellVariants({ padding: finalPadding, border: resolvedBorder, align }),
          className
        )}
      >
        {children}
      </td>
    );
  })
);
