import { cn } from '@ermnvldmr/stl';
import React from 'react';

/**
 * Props for the Stub (Skeleton) component.
 */
export interface StubProps {
  /** Width of the stub */
  width?: string | number;
  /** Height of the stub */
  height?: string | number;
  /** Corner radius variant */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Additional CSS classes */
  className?: string;
  /** Whether to animate the shimmering effect */
  animate?: boolean;
}

/**
 * A skeleton placeholder component with a shimmering animation.
 * Used to indicate loading states while maintaining layout stability.
 *
 * @param props - Component properties
 * @param props.width - Width of the stub
 * @param props.height - Height of the stub
 * @param props.rounded - Corner radius variant
 * @param props.className - Additional CSS classes
 * @param props.animate - Whether to animate the shimmering effect
 * @returns A shimmering skeleton element
 * @example
 * <Stub width="100%" height="20px" rounded="sm" />
 */
export const Stub: React.FC<StubProps> = ({
  width,
  height,
  rounded = 'md',
  className,
  animate = true,
}) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'bg-[var(--rb-color-neutral-100)] dark:bg-[var(--rb-color-neutral-800)]',
        animate && 'animate-shimmer',
        roundedClasses[rounded],
        className
      )}
      data-testid="stub"
      style={{ width, height }}
    />
  );
};
