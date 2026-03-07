/**
 * Minimal deep merge utility for Rsbuild configurations.
 * Concatenates arrays and recursively merges objects.
 *
 * @param source - The source object
 * @param target - The target object to merge into source
 * @returns The merged object
 */
export function mergeConfig<T>(source: any, target: any): T {
  if (target === undefined) return source;
  if (source === undefined) return target;

  if (Array.isArray(source) && Array.isArray(target)) {
    return [...source, ...target] as any;
  }

  if (
    source !== null &&
    typeof source === 'object' &&
    !Array.isArray(source) &&
    target !== null &&
    typeof target === 'object' &&
    !Array.isArray(target)
  ) {
    const result = { ...source };
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        result[key] = mergeConfig(source[key], target[key]);
      }
    }
    return result as any;
  }

  return target;
}
