import React from 'react';

/**
 * A type-safe version of React.memo that preserves generic types.
 *
 * @param component - The component to memoize
 * @returns The memoized component
 * @example
 * ```tsx
 * export const MyComponent = genericMemo(MyGenericComponent);
 * ```
 */
export function genericMemo<T>(component: T): T {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-explicit-any
  return React.memo(component as any) as any as T;
}
