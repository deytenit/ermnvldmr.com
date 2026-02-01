import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef, useRef } from 'react';
import { useButton, useLink, useFocusRing, useHover } from 'react-aria';

import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';
import type { AriaButtonProps, AriaLinkOptions } from 'react-aria';

/**
 * Button visual style variants.
 */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';

/**
 * Button color themes.
 */
export type ButtonColor =
  | 'primary'
  | 'primary-negative'
  | 'secondary'
  | 'secondary-negative'
  | 'tertiary'
  | 'tertiary-negative'
  | 'error'
  | 'error-negative'
  | 'neutral'
  | 'neutral-negative';

/**
 * Button size variants.
 */
export type ButtonSize = 's' | 'm' | 'l';

/**
 * Props shared by both action and link button variants.
 */
interface BaseButtonProps extends ClassNameProps, TestIdProps {
  /** Content to be rendered inside the button */
  children?: React.ReactNode;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Color theme */
  color?: ButtonColor;
  /** Button size */
  size?: ButtonSize;
  /** Render prop for icon at the start */
  renderStartIcon?: (className: string) => React.ReactNode;
  /** Render prop for icon at the end */
  renderEndIcon?: (className: string) => React.ReactNode;
  /** Whether the button takes full width of container */
  fullWidth?: boolean;
  /** Corner radius variant */
  rounded?: 'none' | 'md' | 'full';
  /** Whether the button is disabled */
  isDisabled?: boolean;
}

/**
 * Props for a button acting as a standard button element.
 */
interface ActionButtonProps
  extends BaseButtonProps,
    Omit<AriaButtonProps, 'children' | 'isDisabled' | 'elementType'> {
  href?: never;
}

/**
 * Props for a button acting as a navigation link.
 */
interface LinkButtonProps
  extends BaseButtonProps,
    Omit<AriaLinkOptions, 'children' | 'isDisabled' | 'elementType'> {
  href: string;
}

/**
 * Unified Button props supporting both action and link modes.
 */
export type ButtonProps = ActionButtonProps | LinkButtonProps;

/**
 * A highly extensible, polymorphic button component.
 *
 * Button handles both action-based and navigation-based interactions while
 * maintaining a unified visual style adhering to the Rainby design system.
 */
const ButtonComponent = forwardRef<HTMLElement, ButtonProps>(function Button(props, ref) {
  const {
    children,
    variant = 'solid',
    color = 'primary',
    size = 'm',
    renderStartIcon,
    renderEndIcon,
    fullWidth = false,
    rounded = 'md',
    className,
    'data-testid': testId,
    isDisabled,
    href,
  } = props;

  const internalRef = useRef<HTMLElement>(null);
  const targetRef = ref ? castRef<HTMLElement>(ref) : internalRef;

  // Hooks for interactions
  // We explicitly construct the props object to avoid unsafe casting of the Union type.
  const buttonHookProps = {
    ...props,
    isDisabled,
    elementType: href ? ('a' as const) : ('button' as const),
  };

  const { buttonProps } = useButton(buttonHookProps, castRef<HTMLButtonElement>(targetRef));

  const linkHookProps: AriaLinkOptions = {
    ...props,
    isDisabled,
    elementType: 'a',
    href: typeof href === 'string' ? href : undefined,
  };

  const { linkProps } = useLink(linkHookProps, castRef<HTMLAnchorElement>(targetRef));
  const { focusProps, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({ isDisabled });

  // Styles mapping
  const sizeClasses: Record<ButtonSize, string> = {
    s: 'h-8 px-3 text-sm gap-1.5',
    m: 'h-10 px-4 text-base gap-2',
    l: 'h-12 px-6 text-lg gap-3',
  };

  const iconClasses: Record<ButtonSize, string> = {
    s: 'w-4 h-4',
    m: 'w-5 h-5',
    l: 'w-6 h-6',
  };

  const roundedClasses: Record<string, string> = {
    none: 'rounded-none',
    md: 'rounded-md',
    full: 'rounded-full',
  };

  const getVariantClasses = (): string => {
    const isNegative = color.endsWith('-negative');
    const baseColor = color.replace('-negative', '');

    const colors: Record<string, { base: string; text: string }> = {
      primary: { base: 'var(--rb-primary-base)', text: 'var(--rb-primary-text)' },
      secondary: { base: 'var(--rb-secondary-base)', text: 'var(--rb-secondary-text)' },
      tertiary: { base: 'var(--rb-tertiary-base)', text: 'var(--rb-tertiary-text)' },
      error: { base: 'var(--rb-error-base)', text: 'var(--rb-error-text)' },
      neutral: { base: 'var(--rb-muted-base)', text: 'var(--rb-text)' },
    };

    const colorValues = colors[baseColor];
    const backgroundColor = isNegative ? colorValues.text : colorValues.base;
    const foregroundColor = isNegative ? colorValues.base : colorValues.text;

    switch (variant) {
      case 'solid':
        return `bg-[${backgroundColor}] text-[${foregroundColor}] border-transparent`;
      case 'outline':
        return `bg-transparent text-[${backgroundColor}] border-[${backgroundColor}] border-2`;
      case 'ghost':
        return `bg-transparent text-[${backgroundColor}] border-transparent hover:bg-[${backgroundColor}]/10`;
      case 'link':
        return `bg-transparent text-[${backgroundColor}] border-transparent underline-offset-4 hover:underline px-0 h-auto`;
      default:
        return '';
    }
  };

  const sharedClasses = cn(
    'inline-flex items-center justify-center font-medium transition-all duration-200 select-none outline-none relative overflow-hidden',
    'active:scale-[0.98]',
    sizeClasses[size],
    roundedClasses[rounded],
    getVariantClasses(),
    fullWidth && 'w-full',
    isDisabled && 'opacity-50 cursor-not-allowed grayscale-[0.5] active:scale-100',
    isFocusVisible && 'ring-2 ring-[var(--rb-ring)] ring-offset-2',
    isHovered && !isDisabled && 'brightness-95 dark:brightness-105',
    className
  );

  const content = (
    <>
      {renderStartIcon?.(iconClasses[size])}
      {children}
      {renderEndIcon?.(iconClasses[size])}
    </>
  );

  if (href) {
    return (
      <a
        {...linkProps}
        {...focusProps}
        {...hoverProps}
        ref={castRef<HTMLAnchorElement>(targetRef)}
        className={sharedClasses}
        data-testid={testId}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      {...buttonProps}
      {...focusProps}
      {...hoverProps}
      ref={castRef<HTMLButtonElement>(targetRef)}
      className={sharedClasses}
      data-testid={testId}
    >
      {content}
    </button>
  );
});

export const Button = genericMemo(ButtonComponent);
