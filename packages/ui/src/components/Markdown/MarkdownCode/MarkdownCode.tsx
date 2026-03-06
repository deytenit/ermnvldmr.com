import React, { memo, useMemo } from 'react';

import { Code } from '../../Code/Code';

import type { CodeProps } from '../../Code/Code';
import type { CodeLanguage } from '../../Code/lib/highlighter/highlighter';

/**
 * A Markdown code component for inline snippets.
 */
export const MarkdownCode = memo(function MarkdownCode(props: CodeProps) {
  const { className, ...rest } = props;

  const language = useMemo(() => {
    if (className) {
      const match = /language-(\w+)/.exec(className);
      if (match) {
        return match[1] as CodeLanguage;
      }
    }
    return undefined;
  }, [className]);

  return <Code language={language} {...rest} />;
});
