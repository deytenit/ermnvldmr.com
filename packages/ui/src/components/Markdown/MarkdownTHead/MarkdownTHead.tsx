import React, { memo } from 'react';

import { Table } from '../../Table/Table';

/**
 * A Markdown table head (thead) component.
 */
export const MarkdownTHead = memo(function MarkdownTHead(
  props: React.HTMLAttributes<HTMLTableSectionElement>
) {
  return <Table.Header {...props} />;
});
