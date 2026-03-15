import { cn, genericMemo, useIntersectionObserver, castMutableRef } from '@ermnvldmr/stl';
import React, { forwardRef, useState, useEffect, useRef } from 'react';

import {
  getTypographyClassNames,
  type TextType,
  type TextSize,
  type TextColor,
  type TextAlign,
  type TextWrap,
  type TextOverflow,
} from '../../lib/typography';

import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';

export type { TextType, TextSize, TextColor, TextAlign, TextWrap, TextOverflow };

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
  align?: TextAlign;
  /** Text wrapping behavior */
  wrap?: TextWrap;
  /** Overflow behavior for single lines */
  overflow?: TextOverflow;
  /** Maximum number of lines to show (truncates with ellipsis) */
  maxLines?: number;
  /** Delay in milliseconds before the text appears after entering the viewport. */
  delay?: number;
  /** Underlying element's HTML type attribute (e.g. "button", "submit") */
  htmlType?: string;
}

/**
 * A flexible typography component that implements the design system's type scale.
 *
 * Text centralizes all typography rules — font families, sizes, line heights,
 * letter spacing, colors, and decorations — via the getTypographyClassNames utility.
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
    delay,
    as: Component = 'span',
    htmlType,
    className,
    'data-testid': testId,
    ...props
  },
  ref
) {
  const [isVisible, setIsVisible] = useState(delay === undefined);
  const internalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref) return;
    if (typeof ref === 'function') {
      ref(internalRef.current);
    } else {
      castMutableRef<HTMLElement>(ref).current = internalRef.current;
    }
  }, [ref]);

  const isIntersecting = useIntersectionObserver(internalRef, {
    threshold: 0.1,
    once: true,
  });

  useEffect(() => {
    if (delay !== undefined && isIntersecting) {
      if (delay > 0) {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
      } else {
        setIsVisible(true);
      }
    }
    return undefined;
  }, [delay, isIntersecting]);

  return (
    <Component
      {...props}
      ref={internalRef}
      className={cn(
        getTypographyClassNames({ type, size, color, bold, italic, underline, strike, align, wrap, overflow, maxLines }),
        delay !== undefined &&
          (isVisible
            ? 'animate-in fade-in slide-in-from-bottom-2 duration-1000 ease-out'
            : 'opacity-0'),
        className
      )}
      data-testid={testId}
      type={htmlType ?? (Component === 'button' ? 'button' : undefined)}
    >
      {children}
    </Component>
  );
});

export const Text = genericMemo(TextComponent);
