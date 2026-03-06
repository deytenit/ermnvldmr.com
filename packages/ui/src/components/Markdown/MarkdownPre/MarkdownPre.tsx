import React, { memo, useMemo } from 'react';

import { CodeBlock } from '../../Code/CodeBlock/CodeBlock';

import type { CodeBlockProps } from '../../Code/CodeBlock/CodeBlock';
import type { CodeLanguage } from '../../Code/lib/highlighter/highlighter';

/**
 * A Markdown pre component for code blocks.
 *
 * Wraps content in the design system CodeBlock.
 */
export const MarkdownPre = memo(function MarkdownPre(props: CodeBlockProps) {
  const { children, ...rest } = props;

  // MDX often passes a <code> element as the only child of <pre>.
  // That <code> element usually has the language class (e.g., "language-typescript").
  const language = useMemo(() => {
    if (React.isValidElement<{ className?: string }>(children) && children.props.className) {
      const className = children.props.className;
      const match = /language-(\w+)/.exec(className);
      if (match) {
        // We cast here because we know it comes from markdown,
        // shiki will handle it or fallback to plaintext if unknown at runtime.
        return match[1] as CodeLanguage;
      }
    }
    return undefined;
  }, [children]);

  return (
    <CodeBlock language={language} {...rest}>
      {children}
    </CodeBlock>
  );
});
