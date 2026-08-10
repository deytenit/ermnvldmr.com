import { Paragraph } from '@ermnvldmr/ui';
import React, { memo } from 'react';


import type { ParagraphProps } from '@ermnvldmr/ui';

/**
 * A Markdown paragraph component that wraps the design system Paragraph.
 *
 * Automatically applies gutterBottom for consistent vertical rhythm.
 */
export const MarkdownP = memo(function MarkdownP(props: ParagraphProps) {
  return <Paragraph gutterBottom {...props} />;
});
