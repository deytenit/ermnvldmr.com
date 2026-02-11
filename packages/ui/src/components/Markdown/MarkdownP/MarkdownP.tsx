import React, { memo } from 'react';

import { Paragraph } from '../../Paragraph/Paragraph';

import type { ParagraphProps } from '../../Paragraph/Paragraph';

/**
 * A Markdown paragraph component that wraps the design system Paragraph.
 *
 * Automatically applies gutterBottom for consistent vertical rhythm.
 */
export const MarkdownP = memo(function MarkdownP(props: ParagraphProps) {
  return <Paragraph gutterBottom {...props} />;
});
