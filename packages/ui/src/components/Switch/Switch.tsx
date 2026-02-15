import { cn } from '@ermnvldmr/stl';
import React, { useRef } from 'react';
import { useSwitch, useFocusRing, VisuallyHidden } from 'react-aria';
import { useToggleState } from 'react-stately';

import { Text } from '../Text/Text';

import type { AriaSwitchProps } from 'react-aria';

/**
 * Switch visual style variants.
 */
export type SwitchVariant = 'solid' | 'outline' | 'ghost';

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
export interface SwitchProps extends AriaSwitchProps {
  /** Optional class name for the outer container */
  className?: string;
  /** Optional label for the switch */
  children?: React.ReactNode;
  /** Visual style variant */
  variant?: SwitchVariant;
  /** Color theme */
  color?: SwitchColor;
}

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
  const { children, className, variant = 'solid', color = 'primary' } = props;
  const state = useToggleState(props);
  const ref = useRef<HTMLInputElement>(null);
  const { inputProps } = useSwitch(props, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  const getVariantStyles = (): React.CSSProperties => {
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

    if (!state.isSelected) {
      return {};
    }

    switch (variant) {
      case 'solid':
        return { backgroundColor };
      case 'outline':
        return { borderColor: backgroundColor };
      case 'ghost':
        return { backgroundColor: `${backgroundColor}33`, borderColor: 'transparent' }; // 33 is 20% opacity in hex
      default:
        return { backgroundColor };
    }
  };

  const getThumbStyles = (): React.CSSProperties => {
    const isNegative = color.endsWith('-negative');
    const baseColor = color.replace('-negative', '');

    const colors: Record<string, { text: string }> = {
      primary: { text: 'var(--rb-primary-text)' },
      secondary: { text: 'var(--rb-secondary-text)' },
      tertiary: { text: 'var(--rb-tertiary-text)' },
      error: { text: 'var(--rb-error-text)' },
      neutral: { text: 'var(--rb-text)' },
    };

    const thumbColor = isNegative ? 'var(--rb-base)' : colors[baseColor].text;

    if (!state.isSelected) {
      return {};
    }

    switch (variant) {
      case 'solid':
        return { backgroundColor: thumbColor };
      case 'outline':
      case 'ghost':
        return { backgroundColor: isNegative ? 'var(--rb-text)' : `var(--rb-${baseColor}-base)` };
      default:
        return { backgroundColor: thumbColor };
    }
  };

  return (
    <label
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
          'relative w-11 h-6 transition-all duration-200 ease-in-out rounded-full outline-none flex items-center',
          !state.isSelected && (variant === 'solid' ? 'bg-[var(--rb-muted-base)]' : variant === 'outline' ? 'bg-transparent border-[var(--rb-muted-base)] border-2' : 'bg-transparent border-transparent'),
          state.isSelected && variant === 'outline' && 'bg-transparent border-2',
          isFocusVisible && 'ring-2 ring-offset-2 ring-[var(--rb-ring)]',
          props.isDisabled && 'grayscale-[0.5]'
        )}
        style={getVariantStyles()}
      >
        <div
          className={cn(
            'w-4 h-4 transition-all duration-200 ease-in-out transform rounded-full shadow-sm',
            !state.isSelected && 'bg-[var(--rb-text)]',
            variant === 'outline' ? 'ml-0.5' : 'ml-1',
            state.isSelected ? (variant === 'outline' ? 'translate-x-4.5' : 'translate-x-5') : 'translate-x-0'
          )}
          style={getThumbStyles()}
        />
      </div>
      {children && (
        <Text bold={state.isSelected} color={state.isSelected ? 'default' : 'muted'} size="s" type="label">
          {children}
        </Text>
      )}
    </label>
  );
}
