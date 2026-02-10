import React, { memo } from 'react';

import { List } from '../../List/List';

import type { ListProps } from '../../List/List';

/**
 * A Markdown unordered list component.
 */
export const MarkdownUL = memo(function MarkdownUL(props: ListProps) {
  return <List spacing="m" variant="unordered" {...props} />;
});
