import { List } from '@ermnvldmr/ui';
import React, { memo } from 'react';


import type { ListProps } from '@ermnvldmr/ui';

/**
 * A Markdown ordered list component.
 */
export const MarkdownOL = memo(function MarkdownOL(props: ListProps) {
  return <List spacing="m" variant="ordered" {...props} />;
});
