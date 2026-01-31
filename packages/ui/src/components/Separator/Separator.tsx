import { cn } from '@ermnvldmr/stl';
import React, { memo } from 'react';

import { VStack } from '../VStack/VStack';

import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';


/**
 * Props for the Separator component.
 */
export interface SeparatorProps extends ClassNameProps, TestIdProps {
  /** Type of separator line styling */
  type?: 'single' | 'double';
  /** Color variant following newspaper design patterns */
  color?: 'black' | 'outline' | 'outline-light';
  /** Orientation of the separator */
  direction?: 'horizontal' | 'vertical';
  /** Whether line ends should be thinned with gradient fade */
  thinned?: boolean;
}

/**
 * A separator component for dividing content sections.
 * 
 * Features:
 * - Single or double line variants inspired by newspaper layout traditions
 * - Multiple color options (black, outline, outline-light) with theme support
 * - Horizontal and vertical orientations
 * - Optional thinned gradient fade effect at line ends (10% fade length)
 * - 2px stroke width following print design standards
 * - Semantic HTML with proper ARIA attributes for accessibility
 * 
 * The component uses CSS mask-image for the thinned effect and CSS custom properties
 * for theme-aware colors. Double separators have 4px spacing between lines.
 * 
 * @example
 * ```tsx
 * // Basic horizontal separator
 * <Separator />
 * 
 * // Double-line separator with black color
 * <Separator type="double" color="black" />
 * 
 * // Vertical separator without thinned ends
 * <Separator direction="vertical" thinned={false} />
 * 
 * // Light separator for subtle content division
 * <Separator color="outline-light" />
 * ```
 */
export const Separator = memo(function Separator({ 
  type = 'single',
  color,
  direction = 'horizontal',
  thinned = true,
  className,
  'data-testid': testId,
}: SeparatorProps) {
  // Default color based on type as specified
  const defaultColor = type === 'single' ? 'outline-light' : 'outline';
  const finalColor = color ?? defaultColor;

  // Color mapping to CSS custom properties
  const colorClasses = {
    black: 'border-foreground',
    outline: 'border-border', 
    'outline-light': 'border-muted',
  };

  // Base line styles
  const lineBaseClasses = [
    'border-0',
    'border-solid',
    colorClasses[finalColor],
    // 2px stroke as specified
    direction === 'horizontal' ? 'border-t-2' : 'border-l-2',
  ];

  // Thinned effect using CSS mask
  const thinnedClasses = thinned ? [
    direction === 'horizontal' 
      ? '[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]'
      : '[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]',
  ] : [];

  // Size classes - fill container by default
  const sizeClasses = direction === 'horizontal' 
    ? ['w-full', 'h-0']  // Full width, no height (border provides the visual)
    : ['h-full', 'w-0'];  // Full height, no width (border provides the visual)

  // Single line implementation
  if (type === 'single') {
    const lineClasses = cn(
      ...lineBaseClasses,
      ...thinnedClasses,
      ...sizeClasses,
      className
    );

    return (
      <div
        aria-orientation={direction}
        className={lineClasses}
        data-testid={testId}
        role="separator"
      />
    );
  }

  // Double line implementation
  const singleLineClasses = cn(
    ...lineBaseClasses,
    ...thinnedClasses,
    ...sizeClasses
  );

  const containerClasses = cn(
    direction === 'horizontal' ? 'w-full' : 'h-full',
    className
  );

  if (direction === 'horizontal') {
    return (
      <div
        aria-orientation="horizontal"
        className={containerClasses}
        data-testid={testId}
        role="separator"
      >
        <VStack gap={1}>
          <div 
            aria-hidden="true"
            className={singleLineClasses}
          />
          <div 
            aria-hidden="true"
            className={singleLineClasses}
          />
        </VStack>
      </div>
    );
  } else {
    return (
      <div 
        aria-orientation="vertical"
        className={cn('flex flex-row gap-1', containerClasses)}
        data-testid={testId}
        role="separator"
      >
        <div aria-hidden="true" className={singleLineClasses} />
        <div aria-hidden="true" className={singleLineClasses} />
      </div>
    );
  }
});
