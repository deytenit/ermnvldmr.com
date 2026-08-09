import { Table } from '@ermnvldmr/ui';
import React, { memo } from 'react';


/**
 * A Markdown table body (tbody) component.
 */
export const MarkdownTBody = memo(function MarkdownTBody(
  props: React.HTMLAttributes<HTMLTableSectionElement>
) {
  return <Table.Body {...props} />;
});
