import { cn, filterDataAttributes } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import React, { useRef } from 'react';
import { useSwitch, useFocusRing, VisuallyHidden } from 'react-aria';
import { useToggleState } from 'react-stately';

import { Text } from '../Text/Text';

import type { ClassNameProps, DataAttributes } from '@ermnvldmr/stl';
import type { AriaSwitchProps } from 'react-aria';

/**
 * Switch visual style variants.
 */
export type SwitchVariant = 'solid' | 'outline' | 'ghost';

/**
 * Switch size variants.
 */
export type SwitchSize = 's' | 'm' | 'l';

/**
 * Switch color themes.
 */
export type SwitchColor =
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
 * Props for the Switch component.
 */
export interface SwitchProps extends AriaSwitchProps, ClassNameProps, DataAttributes {
  /** Optional class name for the outer container */
  className?: string;
  /** Optional label for the switch */
  children?: React.ReactNode;
  /** Visual style variant */
  variant?: SwitchVariant;
  /** Switch size */
  size?: SwitchSize;
  /** Color theme */
  color?: SwitchColor;
}

const trackVariants = cva(
  'relative transition-all duration-200 ease-in-out rounded-full outline-none flex items-center',
  {
    variants: {
      variant: {
        solid: 'data-[selected=false]:bg-muted',
        outline: 'border-2 data-[selected=false]:bg-transparent data-[selected=false]:border-muted',
        ghost: 'data-[selected=false]:bg-transparent data-[selected=false]:border-transparent',
      },
      size: {
        s: 'w-7 h-4',
        m: 'w-11 h-6',
        l: 'w-14 h-8',
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
    },
    compoundVariants: [
      // primary
      { variant: 'solid', color: 'primary', className: 'data-[selected=true]:bg-primary data-[selected=true]:border-primary' },
      { variant: 'outline', color: 'primary', className: 'data-[selected=true]:bg-primary data-[selected=true]:border-primary' },
      { variant: 'ghost', color: 'primary', className: 'data-[selected=true]:bg-primary/20 data-[selected=true]:border-transparent' },

      // primary-negative
      { variant: 'solid', color: 'primary-negative', className: 'data-[selected=true]:bg-primary-text data-[selected=true]:border-primary-text' },
      { variant: 'outline', color: 'primary-negative', className: 'data-[selected=true]:bg-primary-text data-[selected=true]:border-primary-text' },
      { variant: 'ghost', color: 'primary-negative', className: 'data-[selected=true]:bg-primary-text/20 data-[selected=true]:border-transparent' },

      // secondary
      { variant: 'solid', color: 'secondary', className: 'data-[selected=true]:bg-secondary data-[selected=true]:border-secondary' },
      { variant: 'outline', color: 'secondary', className: 'data-[selected=true]:bg-secondary data-[selected=true]:border-secondary' },
      { variant: 'ghost', color: 'secondary', className: 'data-[selected=true]:bg-secondary/20 data-[selected=true]:border-transparent' },

      // secondary-negative
      { variant: 'solid', color: 'secondary-negative', className: 'data-[selected=true]:bg-secondary-text data-[selected=true]:border-secondary-text' },
      { variant: 'outline', color: 'secondary-negative', className: 'data-[selected=true]:bg-secondary-text data-[selected=true]:border-secondary-text' },
      { variant: 'ghost', color: 'secondary-negative', className: 'data-[selected=true]:bg-secondary-text/20 data-[selected=true]:border-transparent' },

      // tertiary
      { variant: 'solid', color: 'tertiary', className: 'data-[selected=true]:bg-tertiary data-[selected=true]:border-tertiary' },
      { variant: 'outline', color: 'tertiary', className: 'data-[selected=true]:bg-tertiary data-[selected=true]:border-tertiary' },
      { variant: 'ghost', color: 'tertiary', className: 'data-[selected=true]:bg-tertiary/20 data-[selected=true]:border-transparent' },

      // tertiary-negative
      { variant: 'solid', color: 'tertiary-negative', className: 'data-[selected=true]:bg-tertiary-text data-[selected=true]:border-tertiary-text' },
      { variant: 'outline', color: 'tertiary-negative', className: 'data-[selected=true]:bg-tertiary-text data-[selected=true]:border-tertiary-text' },
      { variant: 'ghost', color: 'tertiary-negative', className: 'data-[selected=true]:bg-tertiary-text/20 data-[selected=true]:border-transparent' },

      // error
      { variant: 'solid', color: 'error', className: 'data-[selected=true]:bg-error data-[selected=true]:border-error' },
      { variant: 'outline', color: 'error', className: 'data-[selected=true]:bg-error data-[selected=true]:border-error' },
      { variant: 'ghost', color: 'error', className: 'data-[selected=true]:bg-error/20 data-[selected=true]:border-transparent' },

      // error-negative
      { variant: 'solid', color: 'error-negative', className: 'data-[selected=true]:bg-error-text data-[selected=true]:border-error-text' },
      { variant: 'outline', color: 'error-negative', className: 'data-[selected=true]:bg-error-text data-[selected=true]:border-error-text' },
      { variant: 'ghost', color: 'error-negative', className: 'data-[selected=true]:bg-error-text/20 data-[selected=true]:border-transparent' },

      // neutral
      { variant: 'solid', color: 'neutral', className: 'data-[selected=true]:bg-muted data-[selected=true]:border-muted' },
      { variant: 'outline', color: 'neutral', className: 'data-[selected=true]:bg-muted data-[selected=true]:border-muted' },
      { variant: 'ghost', color: 'neutral', className: 'data-[selected=true]:bg-muted/20 data-[selected=true]:border-transparent' },

      // neutral-negative
      { variant: 'solid', color: 'neutral-negative', className: 'data-[selected=true]:bg-[var(--rb-text)] data-[selected=true]:border-[var(--rb-text)]' },
      { variant: 'outline', color: 'neutral-negative', className: 'data-[selected=true]:bg-[var(--rb-text)] data-[selected=true]:border-[var(--rb-text)]' },
      { variant: 'ghost', color: 'neutral-negative', className: 'data-[selected=true]:bg-[var(--rb-text)]/20 data-[selected=true]:border-transparent' },
    ],
    defaultVariants: {
      variant: 'solid',
      size: 'm',
      color: 'primary',
    },
  }
);

const thumbVariants = cva(
  'transition-all duration-200 ease-in-out transform rounded-full shadow-sm data-[selected=false]:bg-[var(--rb-text)] data-[selected=false]:translate-x-0',
  {
    variants: {
      variant: {
        solid: '',
        outline: '',
        ghost: '',
      },
      size: {
        s: 'w-2.5 h-2.5',
        m: 'w-4 h-4',
        l: 'w-6 h-6',
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
    },
    compoundVariants: [
      // size + variant offsets
      { size: 's', variant: 'solid', className: 'ml-0.5 data-[selected=true]:translate-x-3.5' },
      { size: 's', variant: 'outline', className: 'ml-0.5 data-[selected=true]:translate-x-2.5' },
      { size: 's', variant: 'ghost', className: 'ml-0.5 data-[selected=true]:translate-x-3.5' },
      { size: 'm', variant: 'solid', className: 'ml-1 data-[selected=true]:translate-x-5' },
      { size: 'm', variant: 'outline', className: 'ml-0.5 data-[selected=true]:translate-x-4.5' },
      { size: 'm', variant: 'ghost', className: 'ml-1 data-[selected=true]:translate-x-5' },
      { size: 'l', variant: 'solid', className: 'ml-1 data-[selected=true]:translate-x-6' },
      { size: 'l', variant: 'outline', className: 'ml-0.5 data-[selected=true]:translate-x-5.5' },
      { size: 'l', variant: 'ghost', className: 'ml-1 data-[selected=true]:translate-x-6' },

      // primary
      { variant: 'solid', color: 'primary', className: 'data-[selected=true]:bg-primary-text' },
      { variant: 'outline', color: 'primary', className: 'data-[selected=true]:bg-primary-text' },
      { variant: 'ghost', color: 'primary', className: 'data-[selected=true]:bg-primary' },

      // primary-negative
      { variant: 'solid', color: 'primary-negative', className: 'data-[selected=true]:bg-[var(--rb-base)]' },
      { variant: 'outline', color: 'primary-negative', className: 'data-[selected=true]:bg-[var(--rb-base)]' },
      { variant: 'ghost', color: 'primary-negative', className: 'data-[selected=true]:bg-[var(--rb-text)]' },

      // secondary
      { variant: 'solid', color: 'secondary', className: 'data-[selected=true]:bg-secondary-text' },
      { variant: 'outline', color: 'secondary', className: 'data-[selected=true]:bg-secondary-text' },
      { variant: 'ghost', color: 'secondary', className: 'data-[selected=true]:bg-secondary' },

      // secondary-negative
      { variant: 'solid', color: 'secondary-negative', className: 'data-[selected=true]:bg-[var(--rb-base)]' },
      { variant: 'outline', color: 'secondary-negative', className: 'data-[selected=true]:bg-[var(--rb-base)]' },
      { variant: 'ghost', color: 'secondary-negative', className: 'data-[selected=true]:bg-[var(--rb-text)]' },

      // tertiary
      { variant: 'solid', color: 'tertiary', className: 'data-[selected=true]:bg-tertiary-text' },
      { variant: 'outline', color: 'tertiary', className: 'data-[selected=true]:bg-tertiary-text' },
      { variant: 'ghost', color: 'tertiary', className: 'data-[selected=true]:bg-tertiary' },

      // tertiary-negative
      { variant: 'solid', color: 'tertiary-negative', className: 'data-[selected=true]:bg-[var(--rb-base)]' },
      { variant: 'outline', color: 'tertiary-negative', className: 'data-[selected=true]:bg-[var(--rb-base)]' },
      { variant: 'ghost', color: 'tertiary-negative', className: 'data-[selected=true]:bg-[var(--rb-text)]' },

      // error
      { variant: 'solid', color: 'error', className: 'data-[selected=true]:bg-error-text' },
      { variant: 'outline', color: 'error', className: 'data-[selected=true]:bg-error-text' },
      { variant: 'ghost', color: 'error', className: 'data-[selected=true]:bg-error' },

      // error-negative
      { variant: 'solid', color: 'error-negative', className: 'data-[selected=true]:bg-[var(--rb-base)]' },
      { variant: 'outline', color: 'error-negative', className: 'data-[selected=true]:bg-[var(--rb-base)]' },
      { variant: 'ghost', color: 'error-negative', className: 'data-[selected=true]:bg-[var(--rb-text)]' },

      // neutral
      { variant: 'solid', color: 'neutral', className: 'data-[selected=true]:bg-[var(--rb-text)]' },
      { variant: 'outline', color: 'neutral', className: 'data-[selected=true]:bg-[var(--rb-text)]' },
      { variant: 'ghost', color: 'neutral', className: 'data-[selected=true]:bg-muted' },

      // neutral-negative
      { variant: 'solid', color: 'neutral-negative', className: 'data-[selected=true]:bg-[var(--rb-base)]' },
      { variant: 'outline', color: 'neutral-negative', className: 'data-[selected=true]:bg-[var(--rb-base)]' },
      { variant: 'ghost', color: 'neutral-negative', className: 'data-[selected=true]:bg-[var(--rb-text)]' },
    ],
    defaultVariants: {
      variant: 'solid',
      size: 'm',
      color: 'primary',
    },
  }
);

/**
 * A highly accessible toggle switch component.
 *
 * @param props - The component props.
 * @returns A React element representing the switch.
 * @example
 * ```tsx
 * <Switch onChange={(isSelected) => console.log(isSelected)}>
 *   Toggle Me
 * </Switch>
 * ```
 */
export function Switch(props: SwitchProps): React.JSX.Element {
  const { children, className, variant = 'solid', size = 'm', color = 'primary' } = props;
  const state = useToggleState(props);
  const ref = useRef<HTMLInputElement>(null);
  const { inputProps } = useSwitch(props, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const dataAttributes = filterDataAttributes(props);

  return (
    <label
      {...dataAttributes}
      className={cn(
        'group inline-flex items-center cursor-pointer select-none gap-3',
        props.isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <div
        aria-hidden="true"
        className={cn(
          trackVariants({ variant, size, color }),
          isFocusVisible && 'ring-2 ring-offset-2 ring-[var(--rb-ring)]',
          props.isDisabled && 'grayscale-[0.5]'
        )}
        data-selected={state.isSelected}
      >
        <div
          className={thumbVariants({ variant, size, color })}
          data-selected={state.isSelected}
        />
      </div>
      {children && (
        <Text
          bold={state.isSelected}
          color={state.isSelected ? 'default' : 'muted'}
          size={size}
          type="label"
        >
          {children}
        </Text>
      )}
    </label>
  );
}
