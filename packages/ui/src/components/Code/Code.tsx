import { cn } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { usePress } from 'react-aria';

import { useCodeContext } from './contexts/CodeContext/CodeContext';
import { codeHighlighter } from './lib/highlighter/highlighter';

import type { CodeLanguage } from './lib/highlighter/highlighter';
import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';

export type { CodeLanguage };

const highlightedVariants = cva('block min-w-full font-mono text-sm [&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0', {
  variants: {
    showLineNumbers: {
      true: '[&>pre>code]:[counter-reset:line] [&>pre>code>.line]:relative [&>pre>code>.line]:pl-10 [&>pre>code>.line]:[counter-increment:line] [&>pre>code>.line]:before:content-[counter(line)] [&>pre>code>.line]:before:absolute [&>pre>code>.line]:before:left-0 [&>pre>code>.line]:before:top-0 [&>pre>code>.line]:before:inline-block [&>pre>code>.line]:before:w-8 [&>pre>code>.line]:before:text-right [&>pre>code>.line]:before:text-[var(--rb-muted-text)]/50 [&>pre>code>.line]:before:select-none [&>pre>code>.line]:before:border-r [&>pre>code>.line]:before:border-[var(--rb-outline)]/10 [&>pre>code>.line]:before:pr-3 [&>pre>code>.line]:before:font-mono [&>pre>code>.line]:before:text-[10px]',
      false: '',
    },
  },
  defaultVariants: {
    showLineNumbers: false,
  },
});

const blockVariants = cva('block min-w-full font-mono whitespace-pre', {
  variants: {
    showLineNumbers: {
      true: '[counter-reset:line] [&>span]:relative [&>span]:pl-10 [&>span]:[counter-increment:line] [&>span]:before:content-[counter(line)] [&>span]:before:absolute [&>span]:before:left-0 [&>span]:before:top-[4px] [&>span]:before:inline-block [&>span]:before:w-8 [&>span]:before:text-right [&>span]:before:text-[var(--rb-muted-text)]/50 [&>span]:before:select-none [&>span]:before:border-r [&>span]:before:border-[var(--rb-outline)]/10 [&>span]:before:pr-3 [&>span]:before:font-mono [&>span]:before:text-[10px]',
      false: '',
    },
  },
  defaultVariants: {
    showLineNumbers: false,
  },
});

const inlineVariants = cva(
  'relative inline-block rounded-sm px-1.5 py-0.5 text-sm font-mono text-[var(--rb-color-red-600)] dark:text-[var(--rb-color-red-400)] cursor-pointer transition-all duration-200 hover:text-[var(--rb-color-red-500)] hover:bg-[var(--rb-color-red-500)]/10 active:scale-95',
  {
    variants: {
      isCopied: {
        true: 'bg-[var(--rb-color-red-500)]/20 ring-1 ring-[var(--rb-color-red-500)]/40',
        false: 'bg-transparent ring-1 ring-transparent',
      },
    },
    defaultVariants: {
      isCopied: false,
    },
  }
);

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

  /**
   * The language of the code. Only used when rendered inside a CodeBlock.
   * If provided, shiki will be used for syntax highlighting.
   */
  language?: CodeLanguage;
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
  language: propsLanguage,
  className,
  'data-testid': testId,
}: CodeProps) {
  const context = useCodeContext();
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  const language = propsLanguage ?? context?.language;

  const handleCopy = useCallback(async () => {
    try {
      let textToCopy = copyValue;
      if (!textToCopy) {
        const ref = codeRef.current ?? divRef.current;
        if (ref) {
          textToCopy = ref.innerText;
          if (!textToCopy) {
            textToCopy = ref.textContent ?? undefined;
          }
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

  useEffect(() => {
    if (context?.isInCodeBlock && language && typeof children === 'string') {
      const highlight = async () => {
        try {
          const html = await codeHighlighter.highlight(children, language);
          setHighlightedHtml(html);
        } catch (err) {
          console.error('Failed to highlight code:', err);
        }
      };
      void highlight();
    } else {
      setHighlightedHtml(null);
    }
  }, [children, language, context?.isInCodeBlock]);

  const { pressProps } = usePress({
    onPress: onCopyPress,
  });

  if (context?.isInCodeBlock) {
    const { showLineNumbers } = context;

    let content: React.ReactNode = children;

    if (highlightedHtml) {
      return (
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          ref={divRef}
          className={cn(highlightedVariants({ showLineNumbers }), className)}
          data-testid={testId}
        />
      );
    }

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
        className={cn(blockVariants({ showLineNumbers }), className)}
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
      className={cn(inlineVariants({ isCopied }), className)}
      data-testid={testId}
      role="button"
      tabIndex={0}
    >
      {children}
    </code>
  );
});
