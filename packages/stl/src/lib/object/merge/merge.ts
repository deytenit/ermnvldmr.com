/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unnecessary-type-assertion */
/**
 * Options for the merge utility.
 */
export interface MergeOptions {
  /**
   * Whether to override existing primitive values in the source with values from the target.
   * If false, existing primitive values are preserved.
   * @default false
   */
  force?: boolean;
}

/**
 * Deeply merges two values (objects, arrays, or primitives).
 *
 * Behavior:
 * - If both values are arrays, they are concatenated.
 * - If both values are objects, they are merged recursively.
 * - If encounter a primitive value, it is overridden only if `force` is set to true.
 * - If a key exists in target but not in source, it is added to the result.
 *
 * @param source - The source value to merge from
 * @param target - The target value to merge with
 * @param options - Merge configuration options
 * @returns The merged result
 *
 * @example
 * ```typescript
 * merge({ a: 1 }, { a: 2 }) // { a: 1 }
 * merge({ a: 1 }, { a: 2 }, { force: true }) // { a: 2 }
 * merge({ a: [1] }, { a: [2] }) // { a: [1, 2] }
 * merge({ a: { b: 1 } }, { a: { c: 2 } }) // { a: { b: 1, c: 2 } }
 * ```
 */
export function merge<T = any>(source: any, target: any, options: MergeOptions = {}): T {
  const { force = false } = options;

  // If target is undefined, source wins
  if (target === undefined) {
    return source;
  }
  // If source is undefined, target wins
  if (source === undefined) {
    return target;
  }

  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);

  // If both are arrays, concatenate
  if (sourceIsArray && targetIsArray) {
    return [...source, ...target] as any;
  }

  const sourceIsObject = source !== null && typeof source === 'object' && !sourceIsArray;
  const targetIsObject = target !== null && typeof target === 'object' && !targetIsArray;

  // If both are objects, deep merge
  if (sourceIsObject && targetIsObject) {
    const result = { ...source };
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        if (key in source) {
          result[key] = merge(source[key], target[key], options);
        } else {
          result[key] = target[key];
        }
      }
    }
    return result as any;
  }

  // If we encounter primitive values or mixed types, override only if force is true
  return force ? target : source;
}
