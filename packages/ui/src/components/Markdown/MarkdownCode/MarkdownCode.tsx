import React, { memo } from 'react';

import { Code } from '../../Code/Code';

import type { CodeProps } from '../../Code/Code';

/**
 * A Markdown code component for inline snippets.
 */
export const MarkdownCode = memo(function MarkdownCode(props: CodeProps) {
  return <Code {...props} />;
});
