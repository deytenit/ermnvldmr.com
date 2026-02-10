import { cn } from '@ermnvldmr/stl';
import { Check, Copy } from 'lucide-react';
import React, { memo, useCallback, useEffect, useRef, useState, useMemo } from 'react';

import { Button } from '../../Button/Button';
import { Container } from '../../Container/Container';
import { CodeContext, type CodeContextValue } from '../contexts/CodeContext/CodeContext';

import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';

/**
 * Props for the CodeBlock component.
 */
export interface CodeBlockProps extends ClassNameProps, TestIdProps {
  /** The content to display, typically a Code component. */
  children: React.ReactNode;

  /**
   * Optional label text (e.g., filename "index.ts", language "bash")
   * displayed in the top-left corner.
   */
  label?: string;

  /**
   * Whether to render line number gutters.
   * Requires children (Code) to be rendered as block-level elements.
   * @default true
   */
  showLineNumbers?: boolean;

  /**
   * Raw string value to copy to clipboard.
   * If omitted, the component will attempt to extract text from its content.
   */
  copyValue?: string;

  /**
   * Maximum height of the code block before vertical scrolling is enabled.
   */
  maxHeight?: string | number;
}

/**
 * A container for multi-line source code display.
 *
 * It provides a framed container with optional label, copy-to-clipboard button,
 * and line numbering support for its children.
 */
export const CodeBlock = memo(function CodeBlock({
  children,
  label,
  showLineNumbers = true,
  copyValue,
  maxHeight,
  className,
  'data-testid': testId,
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = useCallback(async () => {
    try {
      let textToCopy = copyValue;
      if (!textToCopy && preRef.current) {
        textToCopy = preRef.current.innerText;
        if (!textToCopy) {
          textToCopy = preRef.current.textContent ?? undefined;
        }
      }

      if (textToCopy) {
        await navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
      }
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [copyValue]);

  const onCopyPress = useCallback(() => {
    void handleCopy();
  }, [handleCopy]);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const contextValue = useMemo<CodeContextValue>(
    () => ({
      isInCodeBlock: true,
      showLineNumbers,
    }),
    [showLineNumbers]
  );

  return (
    <Container
      border
      bg="base"
      className={cn('relative group overflow-hidden', className)}
      data-testid={testId}
      rounded="md"
    >
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 h-0 z-10 pointer-events-none">
        {label && (
          <span className="absolute top-2 left-4 text-xs font-mono text-[var(--rb-muted-text)] select-none bg-[var(--rb-container-base)]/80 backdrop-blur-sm px-1.5 rounded pointer-events-auto">
            {label}
          </span>
        )}
        <div className="absolute top-2 right-2 pointer-events-auto">
          <Button
            aria-label="Copy code"
            className={cn(
              'h-7 w-7 p-0 bg-[var(--rb-container-base)]/80 backdrop-blur-sm transition-opacity',
              !isCopied && 'opacity-0 group-hover:opacity-100 focus:opacity-100'
            )}
            color="neutral"
            size="s"
            variant="ghost"
            onPress={onCopyPress}
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-[var(--rb-secondary-text)]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Code Area */}
      <pre
        ref={preRef}
        className={cn(
          'overflow-auto p-4 text-sm font-mono leading-relaxed select-text whitespace-pre',
          label && 'pt-8'
        )}
        style={{ maxHeight: maxHeight }}
      >
        <CodeContext.Provider value={contextValue}>{children}</CodeContext.Provider>
      </pre>
    </Container>
  );
});
