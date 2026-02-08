import { createContext, useContext } from 'react';

import type { TableContextValue } from '../../types';

/**
 * Context for sharing table configuration (density, variant, etc.)
 * with sub-components.
 */
export const TableContext = createContext<TableContextValue | null>(null);

/**
 * Hook to access the Table configuration context.
 * Must be used within a Table component.
 *
 * @returns The current table context value.
 * @throws Error if used outside of a Table component.
 *
 * @example
 * ```tsx
 * const { density, striped } = useTableContext();
 * ```
 */
export function useTableContext(): TableContextValue {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('Table sub-components must be used within a Table component.');
  }
  return context;
}
