import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';

import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';

/**
 * Tailwind gap spacing scale values.
 */
type GapScale = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52 | 56 | 60 | 64 | 72 | 80 | 96;

/**
 * Flexbox direction values.
 */
type FlexDirection = 'row' | 'col' | 'row-reverse' | 'col-reverse';

/**
 * Flexbox justify-content values.
 */
type JustifyContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';

/**
 * Flexbox align-items values.
 */
type AlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch';

/**
 * Flexbox flex-wrap values.
 */
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

/**
 * Props for the flexible Stack layout component.
 */
export interface StackProps extends ClassNameProps, TestIdProps {
  /** Content to be arranged in the stack */
  children: React.ReactNode;
  /** Flexbox direction (row, column, or their reverse variants) */
  direction?: FlexDirection;
  /** How to distribute space between and around content items along the main axis */
  justify?: JustifyContent;
  /** How to align items along the cross axis */
  align?: AlignItems;
  /** Whether items should wrap to new lines/columns */
  wrap?: FlexWrap;
  /** Spacing between items using Tailwind's spacing scale */
  gap?: GapScale;
  /** The HTML element to use for rendering */
  as?: React.ElementType;
}

/**
 * A flexible layout component that arranges children using CSS Flexbox.
 * 
 * This component provides a consistent, type-safe way to create flexible layouts
 * with proper spacing and alignment. It supports all major flexbox properties
 * through semantic prop names that map to Tailwind CSS utility classes.
 * 
 * @example
 * ```tsx
 * // Horizontal stack with center alignment
 * <Stack direction="row" align="center" gap={4}>
 *   <button>First</button>
 *   <button>Second</button>
 * </Stack>
 * 
 * // Vertical stack with space between items
 * <Stack direction="col" justify="between" gap={2}>
 *   <div>Header</div>
 *   <div>Content</div>
 *   <div>Footer</div>
 * </Stack>
 * ```
 */
const StackComponent = forwardRef<HTMLElement, StackProps>(function Stack({
  children,
  direction = 'row',
  justify = 'start',
  align = 'start',
  wrap = 'nowrap',
  gap = 0,
  as: Component = 'div',
  className,
  'data-testid': testId,
}, ref) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  } as const;

  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  } as const;

  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  } as const;

  const wrapClasses = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
  } as const;

  // Convert gap scale to Tailwind class using explicit mapping
  // This ensures all gap classes are detected by Tailwind's static analysis
  const gapClasses = {
    0: '',
    0.5: 'gap-0.5',
    1: 'gap-1',
    1.5: 'gap-1.5',
    2: 'gap-2',
    2.5: 'gap-2.5',
    3: 'gap-3',
    3.5: 'gap-3.5',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    7: 'gap-7',
    8: 'gap-8',
    9: 'gap-9',
    10: 'gap-10',
    11: 'gap-10',
    12: 'gap-12',
    14: 'gap-14',
    16: 'gap-16',
    20: 'gap-20',
    24: 'gap-24',
    28: 'gap-28',
    32: 'gap-32',
    36: 'gap-36',
    40: 'gap-40',
    44: 'gap-44',
    48: 'gap-48',
    52: 'gap-52',
    56: 'gap-56',
    60: 'gap-60',
    64: 'gap-64',
    72: 'gap-72',
    80: 'gap-80',
    96: 'gap-96',
  } as const;
  
  const gapClass = gapClasses[gap];

  const stackClasses = cn(
    'flex',
    directionClasses[direction],
    justifyClasses[justify],
    alignClasses[align],
    wrapClasses[wrap],
    gapClass,
    className
  );

  return (
    <Component
      ref={castRef<HTMLElement>(ref)}
      className={stackClasses}
      data-testid={testId}
    >
      {children}
    </Component>
  );
});

export const Stack = genericMemo(StackComponent);
