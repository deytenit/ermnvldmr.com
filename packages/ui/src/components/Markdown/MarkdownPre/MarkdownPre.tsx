import React, { memo } from 'react';

import { CodeBlock } from '../../Code/CodeBlock/CodeBlock';

import type { CodeBlockProps } from '../../Code/CodeBlock/CodeBlock';

/**
 * A Markdown pre component for code blocks.
 *
 * Wraps content in the design system CodeBlock.
 */
export const MarkdownPre = memo(function MarkdownPre(props: CodeBlockProps) {
  return <CodeBlock {...props} />;
});
