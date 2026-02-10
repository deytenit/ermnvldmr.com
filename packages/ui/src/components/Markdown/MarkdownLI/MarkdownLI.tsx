import React, { memo } from 'react';

import { List } from '../../List/List';

import type { ListItemProps } from '../../List/List';

/**
 * A Markdown list item component.
 */
export const MarkdownLI = memo(function MarkdownLI(props: ListItemProps) {
  return <List.Item {...props} />;
});
