import { cn } from '@ermnvldmr/stl';
import { Check, Copy } from 'lucide-react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { usePress } from 'react-aria';

import { Button } from '../Button/Button';
import { Container } from '../Container/Container';

import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';

/**
 *
 */
export interface CodeProps extends ClassNameProps, TestIdProps {
  /** The content to display. Can be a string or pre-highlighted HTML elements. */
  children: React.ReactNode;

  /**
   * Display style of the code.
   * - 'block': Multi-line container with optional scroll, line numbers, and header controls.
   * - 'inline': Compact, clickable snippet for embedding in text.
   * @default 'block'
   */
  variant?: 'block' | 'inline';

  /**
   * Optional label text (e.g., filename "index.ts", language "bash")
   * displayed in the top-left corner of block variants.
   */
  label?: string;

  /**
   * Whether to render line number gutters in block mode.
   * Requires children to be rendered as block-level elements (e.g., via a highlighter).
   * @default true
   */
  showLineNumbers?: boolean;

  /**
   * Raw string value to copy to clipboard.
   * If omitted, the component will attempt to extract text from `children`.
   */
  copyValue?: string;

  /**
   * Maximum height of the code block before vertical scrolling is enabled.
   */
  maxHeight?: string | number;
}

/**
 * A general-purpose wrapper for displaying source code.
 *
 * It supports both block-level (multi-line) and inline (snippet) display modes,
 * with features like line numbering, syntax highlighting containers, and copy-to-clipboard functionality.
 */
export const Code = memo(function Code({
  children,
  variant = 'block',
  label,
  showLineNumbers = true,
  copyValue,
  maxHeight,
  className,
  'data-testid': testId,
}: CodeProps) {
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const handleCopy = useCallback(async () => {
    try {
      let textToCopy = copyValue;
      if (!textToCopy && codeRef.current) {
        textToCopy = codeRef.current.innerText;
        if (!textToCopy) {
          textToCopy = codeRef.current.textContent ?? undefined;
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

  // Inline Variant
  const { pressProps } = usePress({
    onPress: onCopyPress,
  });

  if (variant === 'inline') {
    return (
      <code
        {...pressProps}
        ref={codeRef}
        aria-label="Copy code snippet"
        className={cn(
          'relative inline-block rounded-sm px-1.5 py-0.5 text-sm font-mono',
          'bg-[var(--rb-muted-base)]/50 text-[var(--rb-text)] border border-[var(--rb-outline)]/20',
          'cursor-pointer transition-all duration-200',
          'hover:bg-[var(--rb-muted-base)]/80',
          'active:scale-95',
          isCopied && 'ring-1 ring-[var(--rb-secondary-base)]',
          className
        )}
        data-testid={testId}
        role="button"
        tabIndex={0}
      >
        {children}
      </code>
    );
  }

  // Block Variant
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
        className={cn(
          'overflow-auto p-4 text-sm font-mono leading-relaxed select-text',
          label && 'pt-8' // Add padding if label is present to avoid overlap
        )}
        style={{ maxHeight: maxHeight }}
      >
        <code
          ref={codeRef}
          className={cn(
            'block min-w-full',
            showLineNumbers && [
              '[counter-reset:line] pl-10',
              '[&>*]:relative [&>*]:block',
              '[&>*]:[counter-increment:line]',
              '[&>*]:before:content-[counter(line)]',
              '[&>*]:before:absolute [&>*]:before:left-[-2.5rem]',
              '[&>*]:before:inline-block',
              '[&>*]:before:w-8',
              '[&>*]:before:text-right',
              '[&>*]:before:text-[var(--rb-muted-text)]/50',
              '[&>*]:before:select-none',
              '[&>*]:before:border-r',
              '[&>*]:before:border-[var(--rb-outline)]/10',
              '[&>*]:before:pr-3',
              '[&>*]:before:font-mono [&>*]:before:text-[10px]', // Use mono for numbers too
            ]
          )}
        >
          {children}
        </code>
      </pre>
    </Container>
  );
});
