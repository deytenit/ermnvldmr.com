import { List } from '@ermnvldmr/ui';
import React, { memo } from 'react';


import type { ListProps } from '@ermnvldmr/ui';

/**
 * A Markdown unordered list component.
 */
export const MarkdownUL = memo(function MarkdownUL(props: ListProps) {
  return <List spacing="m" variant="unordered" {...props} />;
});
