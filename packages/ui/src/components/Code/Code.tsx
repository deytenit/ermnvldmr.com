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

    let content = children;
    if (typeof children === 'string') {
      content = children
        .trimEnd()
        .split('\n')
        .map((line, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={i} className="block min-h-[1.5em]">
            {line || '\n'}
          </span>
        ));
    }

    return (
      <code
        ref={codeRef}
        className={cn(
          'block min-w-full font-mono whitespace-pre',
          showLineNumbers && [
            '[counter-reset:line]',
            '[&>span]:relative [&>span]:pl-10',
            '[&>span]:[counter-increment:line]',
            '[&>span]:before:content-[counter(line)]',
            '[&>span]:before:absolute [&>span]:before:left-0 [&>span]:before:top-[4px]',
            '[&>span]:before:inline-block',
            '[&>span]:before:w-8',
            '[&>span]:before:text-right',
            '[&>span]:before:text-[var(--rb-muted-text)]/50',
            '[&>span]:before:select-none',
            '[&>span]:before:border-r',
            '[&>span]:before:border-[var(--rb-outline)]/10',
            '[&>span]:before:pr-3',
            '[&>span]:before:font-mono [&>span]:before:text-[10px]',
          ],
          className
        )}
        data-testid={testId}
      >
        {content}
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
