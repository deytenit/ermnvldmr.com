import type React from 'react';

/**
 * Safely casts a React ref to a specific type.
 * This is a controlled escape hatch for situations where TypeScript's
 * built-in Ref types are too restrictive (e.g., in generic forwardRef components).
 *
 * @param ref - The ref to cast
 * @returns The casted ref
 * @example
 * ```tsx
 * <Component ref={castRef<HTMLDivElement>(ref)} />
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function castRef<T>(ref: any): React.RefObject<T> {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return ref as unknown as React.RefObject<T>;
}
