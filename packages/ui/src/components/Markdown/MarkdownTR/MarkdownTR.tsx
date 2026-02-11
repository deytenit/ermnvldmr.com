import React, { memo } from 'react';

import { Table } from '../../Table/Table';

/**
 * A Markdown table row (tr) component.
 */
export const MarkdownTR = memo(function MarkdownTR(
  props: React.HTMLAttributes<HTMLTableRowElement>
) {
  return <Table.Row {...props} />;
});
