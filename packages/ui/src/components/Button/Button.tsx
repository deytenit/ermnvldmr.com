import { cn, castRef, filterDataAttributes, genericMemo } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import React, { forwardRef, useRef } from 'react';
import { useButton, useLink, useFocusRing, useHover } from 'react-aria';

import type { ClassNameProps, DataAttributes, TestIdProps } from '@ermnvldmr/stl';
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
interface BaseButtonProps extends ClassNameProps, TestIdProps, DataAttributes {
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
  /** Explicitly flag button as icon-only for square aspect ratio */
  isIconOnly?: boolean;
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

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 select-none outline-none relative overflow-hidden cursor-pointer active:scale-[0.98]',
  {
    variants: {
      variant: {
        solid: '',
        outline: '',
        ghost: '',
        link: '',
      },
      color: {
        primary: '',
        'primary-negative': '',
        secondary: '',
        'secondary-negative': '',
        tertiary: '',
        'tertiary-negative': '',
        error: '',
        'error-negative': '',
        neutral: '',
        'neutral-negative': '',
      },
      size: {
        s: 'h-8 px-4 text-sm gap-1.5',
        m: 'h-10 px-6 text-base gap-2',
        l: 'h-12 px-8 text-lg gap-3',
      },
      isIconOnly: {
        true: 'aspect-square px-0',
        false: '',
      },
      rounded: {
        none: 'rounded-none',
        md: 'rounded-md',
        full: 'rounded-full',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      isDisabled: {
        true: 'opacity-50 cursor-not-allowed grayscale-[0.5] active:scale-100',
        false: '',
      },
    },
    compoundVariants: [
      // Primary
      { variant: 'solid', color: 'primary', className: 'bg-primary text-primary-text' },
      { variant: 'solid', color: 'primary-negative', className: 'bg-primary-text text-primary' },
      { variant: 'outline', color: 'primary', className: 'bg-transparent border-2 text-primary border-primary hover:bg-primary/10' },
      { variant: 'outline', color: 'primary-negative', className: 'bg-transparent border-2 text-primary-text border-primary-text hover:bg-primary-text/10' },
      { variant: 'ghost', color: 'primary', className: 'bg-transparent border-transparent text-primary hover:bg-primary/10' },
      { variant: 'ghost', color: 'primary-negative', className: 'bg-transparent border-transparent text-primary-text hover:bg-primary-text/10' },
      { variant: 'link', color: 'primary', className: 'bg-transparent border-transparent underline-offset-4 hover:underline px-0 h-auto text-primary' },
      { variant: 'link', color: 'primary-negative', className: 'bg-transparent border-transparent underline-offset-4 hover:underline px-0 h-auto text-primary-text' },

      // Secondary
      { variant: 'solid', color: 'secondary', className: 'bg-secondary text-secondary-text' },
      { variant: 'solid', color: 'secondary-negative', className: 'bg-secondary-text text-secondary' },
      { variant: 'outline', color: 'secondary', className: 'bg-transparent border-2 text-secondary border-secondary hover:bg-secondary/10' },
      { variant: 'outline', color: 'secondary-negative', className: 'bg-transparent border-2 text-secondary-text border-secondary-text hover:bg-secondary-text/10' },
      { variant: 'ghost', color: 'secondary', className: 'bg-transparent border-transparent text-secondary hover:bg-secondary/10' },
      { variant: 'ghost', color: 'secondary-negative', className: 'bg-transparent border-transparent text-secondary-text hover:bg-secondary-text/10' },
      { variant: 'link', color: 'secondary', className: 'bg-transparent border-transparent underline-offset-4 hover:underline px-0 h-auto text-secondary' },
      { variant: 'link', color: 'secondary-negative', className: 'bg-transparent border-transparent underline-offset-4 hover:underline px-0 h-auto text-secondary-text' },

      // Tertiary
      { variant: 'solid', color: 'tertiary', className: 'bg-tertiary text-tertiary-text' },
      { variant: 'solid', color: 'tertiary-negative', className: 'bg-tertiary-text text-tertiary' },
      { variant: 'outline', color: 'tertiary', className: 'bg-transparent border-2 text-tertiary border-tertiary hover:bg-tertiary/10' },
      { variant: 'outline', color: 'tertiary-negative', className: 'bg-transparent border-2 text-tertiary-text border-tertiary-text hover:bg-tertiary-text/10' },
      { variant: 'ghost', color: 'tertiary', className: 'bg-transparent border-transparent text-tertiary hover:bg-tertiary/10' },
      { variant: 'ghost', color: 'tertiary-negative', className: 'bg-transparent border-transparent text-tertiary-text hover:bg-tertiary-text/10' },
      { variant: 'link', color: 'tertiary', className: 'bg-transparent border-transparent underline-offset-4 hover:underline px-0 h-auto text-tertiary' },
      { variant: 'link', color: 'tertiary-negative', className: 'bg-transparent border-transparent underline-offset-4 hover:underline px-0 h-auto text-tertiary-text' },

      // Error
      { variant: 'solid', color: 'error', className: 'bg-error text-error-text' },
      { variant: 'solid', color: 'error-negative', className: 'bg-error-text text-error' },
      { variant: 'outline', color: 'error', className: 'bg-transparent border-2 text-error border-error hover:bg-error/10' },
      { variant: 'outline', color: 'error-negative', className: 'bg-transparent border-2 text-error-text border-error-text hover:bg-error-text/10' },
      { variant: 'ghost', color: 'error', className: 'bg-transparent border-transparent text-error hover:bg-error/10' },
      { variant: 'ghost', color: 'error-negative', className: 'bg-transparent border-transparent text-error-text hover:bg-error-text/10' },
      { variant: 'link', color: 'error', className: 'bg-transparent border-transparent underline-offset-4 hover:underline px-0 h-auto text-error' },
      { variant: 'link', color: 'error-negative', className: 'bg-transparent border-transparent underline-offset-4 hover:underline px-0 h-auto text-error-text' },

      // Neutral
      { variant: 'solid', color: 'neutral', className: 'bg-muted text-[var(--rb-text)]' },
      { variant: 'solid', color: 'neutral-negative', className: 'bg-[var(--rb-text)] text-muted' },
      { variant: 'outline', color: 'neutral', className: 'bg-transparent border-2 text-muted border-muted hover:bg-muted/10' },
      { variant: 'outline', color: 'neutral-negative', className: 'bg-transparent border-2 text-[var(--rb-text)] border-[var(--rb-text)] hover:bg-[var(--rb-text)]/10' },
      { variant: 'ghost', color: 'neutral', className: 'bg-transparent border-transparent text-muted hover:bg-muted/10' },
      { variant: 'ghost', color: 'neutral-negative', className: 'bg-transparent border-transparent text-[var(--rb-text)] hover:bg-[var(--rb-text)]/10' },
      { variant: 'link', color: 'neutral', className: 'bg-transparent border-transparent underline-offset-4 hover:underline px-0 h-auto text-muted' },
      { variant: 'link', color: 'neutral-negative', className: 'bg-transparent border-transparent underline-offset-4 hover:underline px-0 h-auto text-[var(--rb-text)]' },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'm',
      rounded: 'md',
      fullWidth: false,
      isDisabled: false,
      isIconOnly: false,
    },
  }
);

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
    isDisabled = false,
    isIconOnly: isIconOnlyProp,
    href,
  } = props;

  const internalRef = useRef<HTMLElement>(null);
  const targetRef = ref ? castRef<HTMLElement>(ref) : internalRef;

  const isIconOnly =
    isIconOnlyProp ?? (!children && Boolean(renderStartIcon ?? renderEndIcon));

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
  const iconClasses: Record<ButtonSize, string> = {
    s: 'w-4 h-4',
    m: 'w-5 h-5',
    l: 'w-6 h-6',
  };

  const sharedClasses = cn(
    buttonVariants({ variant, color, size, rounded, fullWidth, isDisabled, isIconOnly }),
    isFocusVisible && 'ring-2 ring-[var(--rb-ring)] ring-offset-2',
    isHovered && !isDisabled && 'brightness-90 dark:brightness-110',
    className
  );

  const content = (
    <>
      {renderStartIcon?.(iconClasses[size])}
      {children}
      {renderEndIcon?.(iconClasses[size])}
    </>
  );

  const dataAttributes = filterDataAttributes(props);

  if (href) {
    return (
      <a
        {...linkProps}
        {...focusProps}
        {...hoverProps}
        {...dataAttributes}
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
      {...dataAttributes}
      ref={castRef<HTMLButtonElement>(targetRef)}
      className={sharedClasses}
      data-testid={testId}
    >
      {content}
    </button>
  );
});

export const Button = genericMemo(ButtonComponent);
