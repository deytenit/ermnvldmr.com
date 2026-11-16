import { createStorageSnapshot, parseStoredJson, StorageCapacityError } from '../storage';

import type { PersistentStorage } from '../storage';

const maxLocalStorageBytes = 256 * 1024;

/**
 * Watches a localStorage key for same-document and cross-document changes.
 *
 * @example
 * const unsubscribe = subscribeToLocalStorage('example/theme', render);
 */
function subscribeToLocalStorage(key: string, listener: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const target = window;

  const handleStorageChange = (event: StorageEvent): void => {
    if (event.key !== key && event.key !== null) return;

    try {
      if (event.storageArea && event.storageArea !== target.localStorage) return;
    } catch {
      return;
    }
    listener();
  };

  target.addEventListener('storage', handleStorageChange);
  return () => target.removeEventListener('storage', handleStorageChange);
}

/**
 * Creates a JSON-backed manager for a localStorage key.
 *
 * Use a namespaced key such as `ermnvldmr/ui/lib/theme` to avoid collisions.
 * The manager uses the supplied default in SSR and when the key cannot be read.
 *
 * @example
 * const theme = createLocalStorage('ermnvldmr/ui/lib/theme', 'system');
 */
export function createLocalStorage<T>(key: string, defaultValue: T): PersistentStorage<T> {
  const get = createStorageSnapshot(
    () => {
      try {
        const item = typeof window === 'undefined' ? null : window.localStorage.getItem(key);
        if (!item) return null;
        return item;
      } catch (error) {
        console.error(
          `[createLocalStorage] Failed to read key "${key}", falling back to default.`,
          error
        );
        return null;
      }
    },
    (item) => {
      try {
        return parseStoredJson<T>(item);
      } catch (error) {
        console.error(
          `[createLocalStorage] Failed to parse key "${key}", falling back to default.`,
          error
        );
        return undefined;
      }
    },
    defaultValue
  );

  /**
   * Broadcasts writes using the native storage event shape.
   *
   * @example
   * notify(storage, serializedValue);
   */
  function notify(storageArea: Storage, newValue: string | null): void {
    window.dispatchEvent(new StorageEvent('storage', { key, newValue, storageArea }));
  }

  return {
    key,
    get,
    getServerSnapshot: () => defaultValue,
    subscribe: (listener) => subscribeToLocalStorage(key, listener),
    set: (value) => {
      if (typeof window === 'undefined') return false;

      try {
        const nextValue = value instanceof Function ? value(get()) : value;
        const raw: unknown = JSON.stringify(nextValue);
        if (typeof raw !== 'string') return false;
        if (new TextEncoder().encode(raw).byteLength > maxLocalStorageBytes) {
          throw new StorageCapacityError(maxLocalStorageBytes);
        }
        const storage = window.localStorage;
        storage.setItem(key, raw);
        notify(storage, raw);
        return true;
      } catch (error) {
        if (error instanceof StorageCapacityError) throw error;
        console.error(`[createLocalStorage] Failed to set key "${key}".`, error);
        return false;
      }
    },
    remove: () => {
      if (typeof window === 'undefined') return false;

      try {
        const storage = window.localStorage;
        storage.removeItem(key);
        notify(storage, null);
        return true;
      } catch (error) {
        console.error(`[createLocalStorage] Failed to remove key "${key}".`, error);
        return false;
      }
    },
  };
}
