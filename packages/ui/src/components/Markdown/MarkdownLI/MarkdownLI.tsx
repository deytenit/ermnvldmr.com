import React, { memo } from 'react';

import { List } from '../../List/List';
import { MarkdownP } from '../MarkdownP/MarkdownP';

import type { ListItemProps } from '../../List/List';

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
