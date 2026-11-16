import { useCallback, useSyncExternalStore } from 'react';

import type { PersistentStorage } from '../../storage';

/**
 * Reads a persistent value in React and returns its setter with a write result.
 *
 * @example
 * const [settings, saveSettings] = useStorage(settingsStorage);
 */
export function useStorage<T>(manager: PersistentStorage<T>): [T, PersistentStorage<T>['set']] {
  const subscribe = useCallback((listener: () => void) => manager.subscribe(listener), [manager]);
  const get = useCallback(() => manager.get(), [manager]);
  const getServerSnapshot = useCallback(() => manager.getServerSnapshot(), [manager]);
  const set = useCallback<PersistentStorage<T>['set']>((value) => manager.set(value), [manager]);

  return [useSyncExternalStore(subscribe, get, getServerSnapshot), set];
}
