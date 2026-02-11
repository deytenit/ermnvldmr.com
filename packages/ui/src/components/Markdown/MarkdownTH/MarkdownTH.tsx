import React, { memo } from 'react';

import { Table } from '../../Table/Table';

/**
 * A Markdown table header cell (th) component.
 */
export const MarkdownTH = memo(function MarkdownTH({
  align,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  const effectiveAlign =
    align === 'left' || align === 'center' || align === 'right' ? align : undefined;

  return <Table.Head {...props} align={effectiveAlign} />;
});
