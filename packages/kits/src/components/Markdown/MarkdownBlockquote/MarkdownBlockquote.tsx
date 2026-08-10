import { Blockquote } from '@ermnvldmr/ui';
import React, { memo } from 'react';


import type { BlockquoteProps } from '@ermnvldmr/ui';

/**
 * A Markdown blockquote component that wraps the design system Blockquote.
 *
 * Automatically applies gutterBottom and indentation.
 */
export const MarkdownBlockquote = memo(function MarkdownBlockquote(props: BlockquoteProps) {
  return <Blockquote gutterBottom indent {...props} />;
});
