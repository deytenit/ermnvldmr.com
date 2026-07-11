import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import React, { forwardRef } from 'react';

import { TableContext } from './contexts/TableContext/TableContext';
import { TableBody } from './TableBody/TableBody';
import { TableCaption } from './TableCaption/TableCaption';
import { TableCell } from './TableCell/TableCell';
import { TableContent } from './TableContent/TableContent';
import { TableFooter } from './TableFooter/TableFooter';
import { TableHead } from './TableHead/TableHead';
import { TableHeader } from './TableHeader/TableHeader';
import { TableRow } from './TableRow/TableRow';

import type { TableContextValue } from './types';

/**
 * Props for the root Table component.
 */
export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement>,
    Partial<TableContextValue> {
  /**
   * Whether the header remains visible during scroll.
   * @default false
   */
  stickyHeader?: boolean;
}

const tableVariants = cva(
  cn(
    'w-full border-collapse caption-bottom text-sm',
    // Mask borders at the edges to prevent doubling with container borders
    '[&_td:first-child]:border-l-0 [&_th:first-child]:border-l-0',
    '[&_td:last-child]:border-r-0 [&_th:last-child]:border-r-0',
    '[&_tr:first-child_td]:border-t-0 [&_tr:first-child_th]:border-t-0',
    '[&_tr:last-child_td]:border-b-0'
  ),
  {
    variants: {
      variant: {
        surface: '',
        outline: '',
        ghost: 'border-none',
      },
      stickyHeader: {
        true: 'relative',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'surface',
      stickyHeader: false,
    },
  }
);

const TableComponent = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    className,
    children,
    density = 'm',
    variant = 'surface',
    striped = false,
    hoverable = false,
    grid = false,
    stickyHeader = false,
    ...props
  },
  ref
) {
  const contextValue: TableContextValue = { density, variant, striped, hoverable, grid };

  return (
    <TableContext.Provider value={contextValue}>
      <table
        {...props}
        ref={castRef<HTMLTableElement>(ref)}
        className={cn(tableVariants({ variant, stickyHeader }), className)}
      >
        {children}
      </table>
    </TableContext.Provider>
  );
});

/**
 * A comprehensive Table system component that uses a compound component pattern.
 *
 * @param props - Component properties
 * @returns The rendered table system
 *
 * @example
 * ```tsx
 * <Table density="s" striped grid>
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.Head>Name</Table.Head>
 *       <Table.Head>Role</Table.Head>
 *     </Table.Row>
 *   </Table.Header>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>Vladimir</Table.Cell>
 *       <Table.Cell>Developer</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table>
 * ```
 */
export const Table = Object.assign(genericMemo(TableComponent), {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
  Content: TableContent,
});
