import { createContext, useContext } from 'react';

/**
 * Context for sharing row-specific configuration with cells.
 */
export interface TableRowContextValue {
  /** Whether the row should have borders */
  noBorder?: boolean;
}

export const TableRowContext = createContext<TableRowContextValue>({ noBorder: false });

/**
 * Hook to access the TableRow context.
 *
 * @returns The current table row context value.
 * @example
 * ```tsx
 * const { noBorder } = useTableRowContext();
 * ```
 */
export function useTableRowContext(): TableRowContextValue {
  return useContext(TableRowContext);
}
