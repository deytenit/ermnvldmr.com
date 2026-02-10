import React, { memo } from 'react';

import { Table } from '../../Table/Table';

/**
 * A Markdown table body (tbody) component.
 */
export const MarkdownTBody = memo(function MarkdownTBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <Table.Body {...props} />;
});
