import type React from 'react';

/**
 * Safely casts a React ref to a mutable ref object.
 * This is a controlled escape hatch for situations where TypeScript's
 * built-in Ref types are too restrictive (e.g., when syncing refs manually).
 *
 * @param ref - The ref to cast
 * @returns The casted mutable ref
 * @example
 * ```tsx
 * const mutableRef = castMutableRef<HTMLDivElement>(ref);
 * mutableRef.current = someElement;
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function castMutableRef<T>(ref: any): React.MutableRefObject<T | null> {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return ref as React.MutableRefObject<T | null>;
}
