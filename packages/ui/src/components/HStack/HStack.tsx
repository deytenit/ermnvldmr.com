import React, { memo, forwardRef } from 'react';

import { Stack } from '../Stack/Stack';

import type { StackProps } from '../Stack/Stack';

/**
 * Props for the HStack component (horizontal stack).
 * Omits direction since HStack is always flex-row.
 */
export interface HStackProps extends Omit<StackProps, 'direction'> {
  /** Content to be arranged horizontally */
  children: React.ReactNode;
}

/**
 * A horizontal stack layout component that arranges children in a row using CSS Flexbox.
 *
 * This is a specialized version of the Stack component with a fixed horizontal direction.
 * It provides a convenient, semantic way to create horizontal layouts without needing
 * to specify direction="row" every time.
 *
 * @example
 * ```tsx
 * // Simple horizontal stack
 * <HStack gap={4}>
 *   <button>First</button>
 *   <button>Second</button>
 *   <button>Third</button>
 * </HStack>
 *
 * // Centered horizontal stack with space between
 * <HStack align="center" justify="between">
 *   <div>Logo</div>
 *   <nav>Navigation</nav>
 *   <div>Profile</div>
 * </HStack>
 * ```
 */
export const HStack = memo(
  forwardRef<HTMLElement, HStackProps>(function HStack(props, ref) {
    return <Stack direction="row" {...props} ref={ref} />;
  })
);
