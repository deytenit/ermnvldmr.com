import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges CSS class names using clsx and tailwind-merge.
 *
 * This utility function combines the power of clsx for conditional class handling
 * with tailwind-merge for proper Tailwind CSS class deduplication and conflict resolution.
 *
 * @param inputs - Class values to combine (strings, objects, arrays, etc.)
 * @returns Merged class string with conflicts resolved
 *
 * @example
 * ```typescript
 * cn('px-4 py-2', 'bg-blue-500') // 'px-4 py-2 bg-blue-500'
 * cn('px-4', { 'px-8': true }) // 'px-8' (px-8 overrides px-4)
 * cn('text-red-500', undefined, 'text-blue-500') // 'text-blue-500'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
