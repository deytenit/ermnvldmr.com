import { Table } from '@ermnvldmr/ui';
import React, { memo } from 'react';


/**
 * A Markdown table head (thead) component.
 */
export const MarkdownTHead = memo(function MarkdownTHead(
  props: React.HTMLAttributes<HTMLTableSectionElement>
) {
  return <Table.Header {...props} />;
});
