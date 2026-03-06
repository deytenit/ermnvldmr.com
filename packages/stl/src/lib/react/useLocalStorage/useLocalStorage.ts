import { useCallback, useSyncExternalStore } from 'react';

import type { StorageManager } from '../../window/localStorage';

/**
 * A React hook that synchronizes state with a StorageManager.
 *
 * It provides reactivity across the component lifecycle and synchronizes
 * values across multiple browser tabs using the 'storage' event.
 *
 * @template T - The type of the stored value.
 * @param manager - The StorageManager instance returned by createLocalStorage.
 * @returns A tuple containing the current value and a setter function.
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage(themeStorage);
 * ```
 */
export function useLocalStorage<T>(
  manager: StorageManager<T>
): [T, (value: T | ((prev: T) => T)) => void] {
  const subscribe = useCallback(
    (callback: () => void) => {
      const handleStorageChange = (event: StorageEvent): void => {
        if (event.key === manager.key) {
          callback();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    },
    [manager.key]
  );

  const getSnapshot = useCallback(() => manager.get(), [manager]);

  const value = useSyncExternalStore(subscribe, getSnapshot, () => {
    // During SSR, we can't access localStorage.
    // However, createLocalStorage is designed to throw if accessed during SSR.
    // This hook is intended to be used in client-side components.
    return manager.get();
  });

  const setValue = useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      manager.set(nextValue);
    },
    [manager]
  );

  return [value, setValue];
}
