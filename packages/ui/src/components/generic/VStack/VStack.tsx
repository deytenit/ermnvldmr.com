import React, { memo } from 'react';

import { Stack } from '../Stack/Stack';

import type { StackProps } from '../Stack/Stack';

/**
 * Props for the VStack component (vertical stack).
 * Omits direction since VStack is always flex-col.
 */
export interface VStackProps extends Omit<StackProps, 'direction'> {
  /** Content to be arranged vertically */
  children: React.ReactNode;
}

/**
 * A vertical stack layout component that arranges children in a column using CSS Flexbox.
 * 
 * This is a specialized version of the Stack component with a fixed vertical direction.
 * It provides a convenient, semantic way to create vertical layouts without needing
 * to specify direction="col" every time.
 * 
 * @example
 * ```tsx
 * // Simple vertical stack
 * <VStack gap={4}>
 *   <div>Header</div>
 *   <div>Content</div>
 *   <div>Footer</div>
 * </VStack>
 * 
 * // Centered vertical stack with spacing
 * <VStack align="center" justify="center" gap={6}>
 *   <h1>Title</h1>
 *   <p>Description</p>
 *   <button>Action</button>
 * </VStack>
 * ```
 */
export const VStack = memo(function VStack(props: VStackProps) {
  return <Stack direction="col" {...props} />;
});
