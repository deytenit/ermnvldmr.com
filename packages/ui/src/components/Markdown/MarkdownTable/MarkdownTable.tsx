import React, { memo } from 'react';

import { Table } from '../../Table/Table';

import type { TableProps } from '../../Table/Table';

/**
 * A Markdown table root component.
 */
export const MarkdownTable = memo(function MarkdownTable(props: TableProps) {
  return <Table density="m" variant="surface" {...props} />;
});
