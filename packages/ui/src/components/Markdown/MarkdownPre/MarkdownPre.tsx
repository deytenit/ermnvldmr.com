import React, { memo, useMemo } from 'react';

import { CodeBlock } from '../../Code/CodeBlock/CodeBlock';
import { SUPPORTED_LANGUAGES } from '../../Code/lib/highlighter/highlighter';

import type { CodeBlockProps } from '../../Code/CodeBlock/CodeBlock';
import type { CodeLanguage } from '../../Code/lib/highlighter/highlighter';

/**
 * Checks if a string is a valid code language.
 * @param lang The string to check.
 * @returns True if the string is a valid code language.
 * @example
 * ```typescript
 * isCodeLanguage('typescript'); // true
 * isCodeLanguage('foo'); // false
 * ```
 */
function isCodeLanguage(lang: string): lang is CodeLanguage {
  return SUPPORTED_LANGUAGES.some((l) => l === lang);
}

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
        const lang = match[1];
        if (isCodeLanguage(lang)) {
          return lang;
        }
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
