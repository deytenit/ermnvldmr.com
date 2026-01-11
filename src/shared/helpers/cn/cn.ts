import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';

/**
 * Combines class names using clsx and tailwind-merge for optimal Tailwind CSS class handling.
 * 
 * This utility function merges class names intelligently by:
 * 1. Using clsx to handle conditional classes, arrays, and objects
 * 2. Using tailwind-merge to resolve conflicting Tailwind classes
 * 
 * @param inputs - Class name inputs (strings, conditionals, arrays, objects)
 * @returns Merged and deduplicated class names string
 * 
 * @example
 * ```typescript
 * cn('p-4 bg-red-500', 'bg-blue-500') // 'p-4 bg-blue-500'
 * cn('p-4', condition && 'bg-red-500') // 'p-4 bg-red-500' | 'p-4'
 * cn('text-sm', { 'font-bold': isActive }) // 'text-sm font-bold' | 'text-sm'
 * cn(['flex', 'items-center'], 'justify-between') // 'flex items-center justify-between'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
