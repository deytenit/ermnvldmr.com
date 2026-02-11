import React, { memo } from 'react';

import { Table } from '../../Table/Table';

/**
 * A Markdown table cell (td) component.
 *
 * Wraps content in Table.Content for consistent styling and alignment.
 */
export const MarkdownTD = memo(function MarkdownTD({
  children,
  align,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  const effectiveAlign =
    align === 'left' || align === 'center' || align === 'right' ? align : undefined;

  return (
    <Table.Cell {...props} align={effectiveAlign}>
      <Table.Content>{children}</Table.Content>
    </Table.Cell>
  );
});
