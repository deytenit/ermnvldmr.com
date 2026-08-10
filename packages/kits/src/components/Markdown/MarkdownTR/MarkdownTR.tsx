import { Table } from '@ermnvldmr/ui';
import React, { memo } from 'react';


/**
 * A Markdown table row (tr) component.
 */
export const MarkdownTR = memo(function MarkdownTR(
  props: React.HTMLAttributes<HTMLTableRowElement>
) {
  return <Table.Row {...props} />;
});
