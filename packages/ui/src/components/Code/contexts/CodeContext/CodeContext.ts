import { createContext, useContext } from 'react';

import type { CodeLanguage } from '../../lib/highlighter/highlighter';

/**
 * Value for the Code context.
 */
export interface CodeContextValue {
  /** Whether the code is rendered inside a CodeBlock. */
  isInCodeBlock: boolean;
  /** Whether to show line numbers in the block. */
  showLineNumbers?: boolean;
  /** The language of the code in the block. */
  language?: CodeLanguage;
}

/**
 * Context for sharing code-related state between CodeBlock and Code components.
 */
export const CodeContext = createContext<CodeContextValue | null>(null);

/**
 * Hook to access the Code context.
 *
 * @returns The current code context value or null if not within a CodeBlock.
 *
 * @example
 * ```tsx
 * const context = useCodeContext();
 * if (context?.isInCodeBlock) {
 *   // ...
 * }
 * ```
 */
export function useCodeContext(): CodeContextValue | null {
  return useContext(CodeContext);
}
