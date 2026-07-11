import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import React, { forwardRef } from 'react';

import { Text } from '../Text/Text';

import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';

/**
 *
 */
export interface BlockquoteProps
  extends ClassNameProps,
    TestIdProps,
    React.BlockquoteHTMLAttributes<HTMLQuoteElement> {
  children: React.ReactNode;
  variant?: 'default' | 'inset';
  gutterBottom?: boolean;
  indent?: boolean;
}

const blockquoteVariants = cva('border-l-4 border-[var(--rb-primary)]', {
  variants: {
    variant: {
      default: '',
      inset: 'bg-[var(--rb-surface-variant)] p-6 rounded-r-lg',
    },
    indent: {
      true: 'pl-6',
      false: '',
    },
    gutterBottom: {
      true: 'mb-6',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    indent: true,
    gutterBottom: false,
  },
});

const BlockquoteComponent = forwardRef<HTMLQuoteElement, BlockquoteProps>(function Blockquote(
  {
    children,
    variant = 'default',
    gutterBottom = false,
    indent = true,
    className,
    'data-testid': testId,
    ...props
  },
  ref
) {
  return (
    <blockquote
      {...props}
      ref={ref}
      className={cn(blockquoteVariants({ variant, indent, gutterBottom }), className)}
      data-testid={testId}
    >
      {children}
    </blockquote>
  );
});

/**
 *
 */
export interface BlockquoteCitationProps
  extends ClassNameProps,
    TestIdProps,
    Omit<React.HTMLAttributes<HTMLElement>, 'prefix'> {
  children: React.ReactNode;
  prefix?: React.ReactNode;
}

const CitationComponent = forwardRef<HTMLElement, BlockquoteCitationProps>(function Citation(
  { children, prefix = '— ', className, 'data-testid': testId, ...props },
  ref
) {
  return (
    <footer
      {...props}
      ref={castRef<HTMLElement>(ref)}
      className={cn('mt-4 flex items-center', className)}
      data-testid={testId}
    >
      <Text color="muted" size="m" type="label">
        {prefix}
        {children}
      </Text>
    </footer>
  );
});

export const Blockquote = Object.assign(genericMemo(BlockquoteComponent), {
  Citation: genericMemo(CitationComponent),
});
