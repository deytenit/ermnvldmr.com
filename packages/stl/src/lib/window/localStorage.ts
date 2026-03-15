/**
 * Manages type-safe interaction with window.localStorage.
 *
 * @template T - The type of the value to store (must be JSON serializable).
 */
export interface StorageManager<T> {
  /** Retrieves the current value or the default value if none exists. */
  get: () => T;
  /** Updates the stored value and persists it. */
  set: (value: T | ((prev: T) => T)) => void;
  /** Removes the item from storage. */
  remove: () => void;
  /** The key used in localStorage. */
  readonly key: string;
}

/**
 * Creates a type-safe manager for a localStorage key.
 *
 * In SSR/SSG context (no window), returns a no-op manager that always
 * returns the default value. In the browser, uses localStorage as usual.
 * Ensure you use a strict namespace for the key to avoid monorepo collisions.
 * Recommended format: `ermnvldmr/{package}/{path}/{module}`
 * Example: `ermnvldmr/ui/lib/theme`
 *
 * @param key - The unique key for storage.
 * @param defaultValue - The fallback value if storage is empty or corrupted.
 * @returns A StorageManager object.
 *
 * @example
 * ```typescript
 * const theme = createLocalStorage('ermnvldmr/ui/lib/theme', 'system');
 * console.log(theme.get());
 * ```
 */
export function createLocalStorage<T>(key: string, defaultValue: T): StorageManager<T> {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return {
      key,
      get: () => defaultValue,
      set: () => {},
      remove: () => {},
    };
  }

  const manager: StorageManager<T> = {
    key,
    get: () => {
      try {
        const item = window.localStorage.getItem(key);
        if (!item) return defaultValue;
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return JSON.parse(item) as T;
      } catch (error) {
        console.error(
          `[createLocalStorage] Failed to parse key "${key}", falling back to default.`,
          error
        );
        return defaultValue;
      }
    },
    set: (value) => {
      try {
        const nextValue = value instanceof Function ? value(manager.get()) : value;
        window.localStorage.setItem(key, JSON.stringify(nextValue));

        // Dispatch a custom event to notify other listeners in the same tab
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: JSON.stringify(nextValue),
            storageArea: window.localStorage,
          })
        );
      } catch (error) {
        console.error(`[createLocalStorage] Failed to set key "${key}".`, error);
      }
    },
    remove: () => {
      window.localStorage.removeItem(key);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key,
          newValue: null,
          storageArea: window.localStorage,
        })
      );
    },
  };

  return manager;
}
