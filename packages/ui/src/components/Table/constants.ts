import type { TablePadding, TableCellBorder } from './types';

/**
 * Shared padding classes based on table density.
 */
export const paddingClasses: Record<TablePadding, string> = {
  none: 'p-0',
  s: 'p-2',
  m: 'p-4',
  l: 'p-6',
};

/**
 * Shared border classes for table cells.
 */
export const borderClasses: Record<TableCellBorder, string> = {
  none: '',
  all: 'border border-[var(--rb-border)]',
  top: 'border-t border-[var(--rb-border)]',
  bottom: 'border-b border-[var(--rb-border)]',
  left: 'border-l border-[var(--rb-border)]',
  right: 'border-r border-[var(--rb-border)]',
  x: 'border-x border-[var(--rb-border)]',
  y: 'border-y border-[var(--rb-border)]',
};
