import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';

import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';

/**
 * Typography types.
 */
export type TextType = 'display' | 'headline' | 'title' | 'body' | 'label';

/**
 * Typography sizes.
 */
export type TextSize = 's' | 'm' | 'l';

/**
 * Text color variants.
 */
export type TextColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'muted'
  | 'inherit';

/**
 * Props for the Text component.
 */
export interface TextProps
  extends ClassNameProps,
    TestIdProps,
    Omit<React.AllHTMLAttributes<HTMLElement>, 'as' | 'type' | 'size' | 'color'> {
  /** Content to be rendered */
  children: React.ReactNode;
  /** Typography style type */
  type?: TextType;
  /** Typography size variant */
  size?: TextSize;
  /** Text color variant */
  color?: TextColor;
  /** Whether the text should be bold */
  bold?: boolean;
  /** Whether the text should be italic */
  italic?: boolean;
  /** Whether the text should be underlined */
  underline?: boolean;
  /** Whether the text should have a strike-through */
  strike?: boolean;
  /** The HTML element to use for rendering */
  as?: React.ElementType;
  /** Optional href for links */
  href?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Text wrapping behavior */
  wrap?: 'nowrap' | 'balance' | 'pretty';
  /** Overflow behavior for single lines */
  overflow?: 'ellipsis' | 'clip';
  /** Maximum number of lines to show (truncates with ellipsis) */
  maxLines?: number;
}

/**
 * A flexible typography component that implements the design system's type scale.
 *
 * Text centralizes all typography rules, including font families, sizes,
 * line heights, and letter spacing, reducing the need for custom CSS.
 */
const TextComponent = forwardRef<HTMLElement, TextProps>(function Text(
  {
    children,
    type = 'body',
    size = 'm',
    color = 'default',
    bold = false,
    italic = false,
    underline = false,
    strike = false,
    align,
    wrap,
    overflow,
    maxLines,
    as: Component = 'span',
    className,
    'data-testid': testId,
    ...props
  },
  ref
) {
  // Base typography styles mapping
  const typeStyles: Record<TextType, Record<TextSize, string>> = {
    display: {
      l: 'font-serif text-[57px] leading-[64px] tracking-[-0.25px]',
      m: 'font-serif text-[45px] leading-[52px] tracking-normal',
      s: 'font-serif text-[36px] leading-[44px] tracking-normal',
    },
    headline: {
      l: 'font-serif text-[32px] leading-[40px] tracking-normal',
      m: 'font-serif text-[28px] leading-[36px] tracking-normal',
      s: 'font-serif text-[24px] leading-[32px] tracking-normal',
    },
    title: {
      l: 'font-sans text-[22px] leading-[28px] tracking-normal',
      m: 'font-sans text-[16px] leading-[24px] tracking-[0.15px]',
      s: 'font-sans text-[14px] leading-[20px] tracking-[0.1px]',
    },
    body: {
      l: 'font-sans text-[16px] leading-[24px] tracking-[0.5px]',
      m: 'font-sans text-[14px] leading-[20px] tracking-[0.25px]',
      s: 'font-sans text-[12px] leading-[16px] tracking-[0.4px]',
    },
    label: {
      l: 'font-sans font-medium text-[14px] leading-[20px] tracking-[0.1px]',
      m: 'font-sans font-medium text-[12px] leading-[16px] tracking-[0.5px]',
      s: 'font-sans font-medium text-[11px] leading-[16px] tracking-[0.5px]',
    },
  };

  const colorClasses: Record<TextColor, string> = {
    default: 'text-[var(--rb-text)]',
    primary: 'text-[var(--rb-primary-text)]',
    secondary: 'text-[var(--rb-secondary-text)]',
    tertiary: 'text-[var(--rb-tertiary-text)]',
    error: 'text-[var(--rb-error-text)]',
    muted: 'text-[var(--rb-muted-text)]',
    inherit: 'text-inherit',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const wrapClasses = {
    nowrap: 'whitespace-nowrap',
    balance: 'text-balance',
    pretty: 'text-pretty',
  };

  let truncationClass = '';
  if (maxLines) {
    truncationClass = `line-clamp-${maxLines}`;
  } else {
    if (overflow === 'ellipsis') truncationClass = 'truncate';
    if (overflow === 'clip') truncationClass = 'overflow-clip';
  }

  return (
    <Component
      {...props}
      ref={castRef<HTMLElement>(ref)}
      className={cn(
        typeStyles[type][size],
        colorClasses[color],
        bold && 'font-bold',
        italic && 'italic',
        underline && 'underline',
        strike && 'line-through',
        align && alignClasses[align],
        wrap && wrapClasses[wrap],
        truncationClass,
        className
      )}
      data-testid={testId}
    >
      {children}
    </Component>
  );
});

export const Text = genericMemo(TextComponent);
