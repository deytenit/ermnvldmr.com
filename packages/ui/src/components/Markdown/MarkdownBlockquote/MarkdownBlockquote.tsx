import React, { memo } from 'react';

import { Blockquote } from '../../Blockquote/Blockquote';

import type { BlockquoteProps } from '../../Blockquote/Blockquote';

/**
 * A Markdown blockquote component that wraps the design system Blockquote.
 *
 * Automatically applies gutterBottom and indentation.
 */
export const MarkdownBlockquote = memo(function MarkdownBlockquote(props: BlockquoteProps) {
  return <Blockquote gutterBottom indent {...props} />;
});
