
import { Code , SUPPORTED_LANGUAGES } from '@ermnvldmr/ui';
import React, { memo, useMemo } from 'react';

import type { CodeProps , CodeLanguage } from '@ermnvldmr/ui';

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
 * A Markdown code component for inline snippets.
 */
export const MarkdownCode = memo(function MarkdownCode(props: CodeProps) {
  const { className, ...rest } = props;

  const language = useMemo(() => {
    if (className) {
      const match = /language-(\w+)/.exec(className);
      if (match) {
        const lang = match[1];
        if (isCodeLanguage(lang)) {
          return lang;
        }
      }
    }
    return undefined;
  }, [className]);

  return <Code language={language} {...rest} />;
});
