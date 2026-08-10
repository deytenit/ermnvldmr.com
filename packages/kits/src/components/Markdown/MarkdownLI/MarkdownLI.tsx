import { List } from '@ermnvldmr/ui';
import React, { memo } from 'react';

import { MarkdownP } from '../MarkdownP/MarkdownP';

import type { ListItemProps } from '@ermnvldmr/ui';

/**
 * A Markdown list item component.
 */
export const MarkdownLI = memo(function MarkdownLI({ children, ...props }: ListItemProps) {
  return (
    <List.Item {...props}>
      <MarkdownP>{children}</MarkdownP>
    </List.Item>
  );
});
