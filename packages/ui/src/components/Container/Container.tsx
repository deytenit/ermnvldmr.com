import { cn } from '@ermnvldmr/stl';
import React, { memo } from 'react';
import { usePress } from 'react-aria';

import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';
import type { PressEvents } from 'react-aria';

/**
 * Tailwind gap spacing scale values.
 */
type GapScale =
  | 0
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 14
  | 16
  | 20
  | 24
  | 28
  | 32
  | 36
  | 40
  | 44
  | 48
  | 52
  | 56
  | 60
  | 64
  | 72
  | 80
  | 96;

/**
 * Background variants for the Container.
 */
export type ContainerBackground =
  | 'base'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'error'
  | 'muted'
  | 'transparent';

/**
 * Max width constraints for the Container.
 */
export type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | 'none';

/**
 * Border radius variants for the Container.
 */
export type ContainerRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';

/**
 * Props for the Container component.
 */
export interface ContainerProps extends ClassNameProps, TestIdProps {
  /** Content to be rendered inside the container */
  children: React.ReactNode;
  /** Background color variant */
  bg?: ContainerBackground;
  /** Padding using Tailwind spacing scale */
  padding?: GapScale;
  /** Maximum width constraint */
  maxWidth?: ContainerMaxWidth;
  /** Border radius variant */
  rounded?: ContainerRounded;
  /** Whether to show a shadow */
  shadow?: boolean;
  /** Whether to show a border */
  border?: boolean;
  /** Press interaction handler */
  onPress?: PressEvents['onPress'];
  /** The HTML element to use for rendering */
  as?: React.ElementType;
}

/**
 * A generic surface component for creating structural layouts.
 *
 * Container provides a consistent way to handle backgrounds, padding,
 * borders, and width constraints while maintaining theme consistency.
 */
export const Container = memo(function Container({
  children,
  bg = 'base',
  padding = 0,
  maxWidth = 'none',
  rounded = 'none',
  shadow = false,
  border = false,
  onPress,
  as: Component = 'div',
  className,
  'data-testid': testId,
}: ContainerProps) {
  const ref = React.useRef<HTMLElement>(null);
  const { pressProps } = usePress({
    onPress,
    isDisabled: !onPress,
  });

  const bgClasses: Record<ContainerBackground, string> = {
    base: 'bg-[var(--rb-container-base)] text-[var(--rb-container-text)]',
    primary: 'bg-[var(--rb-primary-base)] text-[var(--rb-primary-text)]',
    secondary: 'bg-[var(--rb-secondary-base)] text-[var(--rb-secondary-text)]',
    tertiary: 'bg-[var(--rb-tertiary-base)] text-[var(--rb-tertiary-text)]',
    error: 'bg-[var(--rb-error-base)] text-[var(--rb-error-text)]',
    muted: 'bg-[var(--rb-muted-base)] text-[var(--rb-muted-text)]',
    transparent: 'bg-transparent',
  };

  const maxWidthClasses: Record<ContainerMaxWidth, string> = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    none: 'max-w-none',
  };

  const roundedClasses: Record<ContainerRounded, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const paddingClasses: Record<GapScale, string> = {
    0: 'p-0',
    0.5: 'p-0.5',
    1: 'p-1',
    1.5: 'p-1.5',
    2: 'p-2',
    2.5: 'p-2.5',
    3: 'p-3',
    3.5: 'p-3.5',
    4: 'p-4',
    5: 'p-5',
    6: 'p-6',
    7: 'p-7',
    8: 'p-8',
    9: 'p-9',
    10: 'p-10',
    11: 'p-11',
    12: 'p-12',
    14: 'p-14',
    16: 'p-16',
    20: 'p-20',
    24: 'p-24',
    28: 'p-28',
    32: 'p-32',
    36: 'p-36',
    40: 'p-40',
    44: 'p-44',
    48: 'p-48',
    52: 'p-52',
    56: 'p-56',
    60: 'p-60',
    64: 'p-64',
    72: 'p-72',
    80: 'p-80',
    96: 'p-96',
  };

  return (
    <Component
      {...pressProps}
      ref={ref}
      className={cn(
        'overflow-hidden',
        bgClasses[bg],
        maxWidthClasses[maxWidth],
        roundedClasses[rounded],
        paddingClasses[padding],
        shadow && 'shadow-md',
        border && 'border border-[var(--rb-outline)]',
        onPress && 'cursor-pointer active:opacity-80 transition-opacity',
        className
      )}
      data-testid={testId}
    >
      {children}
    </Component>
  );
});
