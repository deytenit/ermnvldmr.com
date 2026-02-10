import { cn } from '@ermnvldmr/stl';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { usePress } from 'react-aria';

import { useCodeContext } from './contexts/CodeContext/CodeContext';

import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';

/**
 * Props for the Code component.
 */
export interface CodeProps extends ClassNameProps, TestIdProps {
  /** The content to display. Can be a string or pre-highlighted HTML elements. */
  children: React.ReactNode;

  /**
   * Raw string value to copy to clipboard (only used in inline mode).
   * If omitted in inline mode, the component will attempt to extract text from `children`.
   */
  copyValue?: string;
}

/**
 * A component for displaying source code.
 *
 * When used inside a `CodeBlock`, it renders a block-level `<code>` element
 * with support for line numbering.
 * When used standalone, it renders an inline snippet that is clickable to copy.
 */
export const Code = memo(function Code({
  children,
  copyValue,
  className,
  'data-testid': testId,
}: CodeProps) {
  const context = useCodeContext();
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

  const { pressProps } = usePress({
    onPress: onCopyPress,
  });

  if (context?.isInCodeBlock) {
    const { showLineNumbers } = context;
    return (
      <code
        ref={codeRef}
        className={cn(
          'block min-w-full font-mono whitespace-pre',
          showLineNumbers && [
            '[counter-reset:line]',
            '[&>*]:relative [&>*]:block [&>*]:pl-10',
            '[&>*]:[counter-increment:line]',
            '[&>*]:before:content-[counter(line)]',
            '[&>*]:before:absolute [&>*]:before:left-0',
            '[&>*]:before:inline-block',
            '[&>*]:before:w-8',
            '[&>*]:before:text-right',
            '[&>*]:before:text-[var(--rb-muted-text)]/50',
            '[&>*]:before:select-none',
            '[&>*]:before:border-r',
            '[&>*]:before:border-[var(--rb-outline)]/10',
            '[&>*]:before:pr-3',
            '[&>*]:before:font-mono [&>*]:before:text-[10px]',
          ],
          className
        )}
        data-testid={testId}
      >
        {children}
      </code>
    );
  }

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
});