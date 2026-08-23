import type { DataAttributes } from '../../types/dataAttributes.js';

/**
 * Filters and extracts all `data-*` attributes from a props object.
 *
 * @param props - Source props object.
 * @returns An object containing only the `data-*` attributes.
 *
 * @example
 * ```typescript
 * const dataAttrs = filterDataAttributes(props);
 * ```
 */
export function filterDataAttributes<T extends object>(props: T): DataAttributes {
  const result: DataAttributes = {};
  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key) && key.startsWith('data-')) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const value: unknown = (props as Record<string, unknown>)[key];
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === undefined
      ) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        result[key as `data-${string}`] = value;
      }
    }
  }
  return result;
}
