import { cn, genericMemo } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import React, { forwardRef } from 'react';

import { Text } from '../Text/Text';

import type { TextProps } from '../Text/Text';

/**
 * Props for the Paragraph component.
 */
export interface ParagraphProps extends Omit<TextProps, 'as'> {
  /** Whether to add a bottom margin (standard vertical rhythm) */
  gutterBottom?: boolean;
  /** Whether to indent the first line */
  indent?: boolean;
  /** Whether to style the first letter as a drop cap */
  dropCap?: boolean;
}

const paragraphVariants = cva('', {
  variants: {
    gutterBottom: {
      true: 'mb-4',
      false: '',
    },
    indent: {
      true: 'indent-8',
      false: '',
    },
    dropCap: {
      true: 'first-letter:text-7xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none',
      false: '',
    },
  },
  defaultVariants: {
    gutterBottom: false,
    indent: false,
    dropCap: false,
  },
});

/**
 * A semantic paragraph component that wraps the Text component.
 *
 * Paragraph provides specialized block-level features like vertical spacing,
 * indentation, and drop caps while inheriting all typographic capabilities
 * of the Text component.
 */
const ParagraphComponent = forwardRef<HTMLElement, ParagraphProps>(function Paragraph(
  { children, gutterBottom = false, indent = false, dropCap = false, className, ...props },
  ref
) {
  return (
    <Text
      ref={ref}
      as="p"
      className={cn(paragraphVariants({ gutterBottom, indent, dropCap }), className)}
      {...props}
    >
      {children}
    </Text>
  );
});

export const Paragraph = genericMemo(ParagraphComponent);
