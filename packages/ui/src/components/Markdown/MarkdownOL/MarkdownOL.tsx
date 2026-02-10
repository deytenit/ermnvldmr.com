import React, { memo } from 'react';

import { List } from '../../List/List';

import type { ListProps } from '../../List/List';

/**
 * A Markdown ordered list component.
 */
export const MarkdownOL = memo(function MarkdownOL(props: ListProps) {
  return <List spacing="m" variant="ordered" {...props} />;
});
