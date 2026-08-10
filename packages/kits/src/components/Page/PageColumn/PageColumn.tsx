import { cn } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import React from 'react';

/**
 * Props for the PageColumn component.
 */
export interface PageColumnProps {
  /** The content of the column. */
  children: React.ReactNode;
  /**
   * The size of the column on desktop.
   * - `small`: Fixed width (300px)
   * - `full`: Takes up remaining space (flex-1)
   * @default 'full'
   */
  size?: 'small' | 'full';
  /**
   * If true, the column will stick to the top when scrolling on desktop.
   * @default false
   */
  sticky?: boolean;
  /**
   * Optional additional class names.
   */
  className?: string;
  /**
   * The HTML element to use for the root of the component.
   * @default 'div'
   */
  as?: React.ElementType;
}

const pageColumnVariants = cva('w-full transition-all duration-200', {
  variants: {
    size: {
      small: 'lg:w-[var(--rb-page-column-small,300px)] lg:flex-none',
      full: 'flex-1',
    },
    sticky: {
      true: 'lg:sticky lg:top-24 self-start',
      false: '',
    },
  },
  defaultVariants: {
    size: 'full',
    sticky: false,
  },
});

/**
 /**
 * A single column unit within the PageColumns host.
 *
 * @param props - The component props.
 * @returns A PageColumn component.
 * @example
 * ```tsx
 * <PageColumn size="small">Sidebar</PageColumn>
 * ```
 */
export const PageColumn = ({
  children,
  size = 'full',
  sticky = false,
  className,
  as: Component = 'div',
}: PageColumnProps) => {
  return (
    <Component className={cn(pageColumnVariants({ size, sticky }), className)}>{children}</Component>
  );
};
