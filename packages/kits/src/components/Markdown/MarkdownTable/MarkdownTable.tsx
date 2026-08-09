import { Table } from '@ermnvldmr/ui';
import React, { memo } from 'react';


import type { TableProps } from '@ermnvldmr/ui';

/**
 * A Markdown table root component.
 */
export const MarkdownTable = memo(function MarkdownTable(props: TableProps) {
  return <Table density="m" variant="surface" {...props} />;
});
