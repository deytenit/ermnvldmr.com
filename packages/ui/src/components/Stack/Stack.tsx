import { cn, castRef, filterDataAttributes, genericMemo } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import React, { forwardRef } from 'react';

import type { SpacingScale } from '../../lib/scale';
import type { ClassNameProps, DataAttributes, TestIdProps } from '@ermnvldmr/stl';

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
export interface StackProps extends ClassNameProps, TestIdProps, DataAttributes {
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
  gap?: SpacingScale;
  /** Whether to enable scrolling when content overflows */
  scrollable?: boolean;
  /** The HTML element to use for rendering */
  as?: React.ElementType;
}

const stackVariants = cva('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      col: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'col-reverse': 'flex-col-reverse',
    },
    justify: {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    align: {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch',
    },
    wrap: {
      nowrap: 'flex-nowrap',
      wrap: 'flex-wrap',
      'wrap-reverse': 'flex-wrap-reverse',
    },
    // Convert gap scale to Tailwind class using explicit mapping
    // This ensures all gap classes are detected by Tailwind's static analysis
    gap: {
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
      11: 'gap-11',
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
    },
    scrollable: {
      true: '',
      false: '',
    },
  },
  // Scroll axis depends on both scrollable and direction:
  // row directions overflow on the x-axis, column directions on the y-axis.
  compoundVariants: [
    { scrollable: true, direction: 'row', className: 'overflow-x-auto' },
    { scrollable: true, direction: 'row-reverse', className: 'overflow-x-auto' },
    { scrollable: true, direction: 'col', className: 'overflow-y-auto' },
    { scrollable: true, direction: 'col-reverse', className: 'overflow-y-auto' },
  ],
  defaultVariants: {
    direction: 'row',
    justify: 'start',
    align: 'start',
    wrap: 'nowrap',
    gap: 0,
    scrollable: false,
  },
});

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
 *
 * // Scrollable row
 * <Stack direction="row" scrollable gap={4}>
 *   {items.map(item => <Item key={item.id} {...item} />)}
 * </Stack>
 * ```
 */
const StackComponent = forwardRef<HTMLElement, StackProps>(function Stack(
  props,
  ref
) {
  const {
    children,
    direction = 'row',
    justify = 'start',
    align = 'start',
    wrap = 'nowrap',
    gap = 0,
    scrollable = false,
    as: Component = 'div',
    className,
    'data-testid': testId,
  } = props;

  const dataAttributes = filterDataAttributes(props);

  return (
    <Component
      {...dataAttributes}
      ref={castRef<HTMLElement>(ref)}
      className={cn(
        stackVariants({ direction, justify, align, wrap, gap, scrollable }),
        className
      )}
      data-testid={testId}
    >
      {children}
    </Component>
  );
});

export const Stack = genericMemo(StackComponent);
