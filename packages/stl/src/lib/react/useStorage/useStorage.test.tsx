import { act, renderHook } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useStorage } from './useStorage';
import { createFragmentStorage } from '../../window/fragmentStorage';
import { createLocalStorage } from '../../window/localStorage';

import type { PersistentStorage } from '../../storage';

const defaultValue = { name: 'default' };

function createFragmentManager() {
  return createFragmentStorage('settings', defaultValue);
}

describe('useStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/test?keep=yes#anchor');
  });

  const adapters: [string, () => PersistentStorage<typeof defaultValue>][] = [
    ['localStorage', () => createLocalStorage('settings', defaultValue)],
    ['fragment', createFragmentManager],
  ];

  it.each(adapters)('shares stable object snapshots through %s', (_, createManager) => {
    const manager = createManager();
    const otherManager = createManager();
    const { result, rerender, unmount } = renderHook(() => useStorage(manager));
    const listener = vi.fn();
    const unsubscribe = manager.subscribe(listener);

    expect(result.current[0]).toBe(defaultValue);
    act(() => {
      expect(otherManager.set({ name: 'other manager' })).toBe(true);
    });
    const persisted = result.current[0];
    expect(persisted.name).toBe('other manager');

    rerender();
    expect(result.current[0]).toBe(persisted);

    act(() => {
      expect(result.current[1](({ name }) => ({ name: `${name} updated` }))).toBe(true);
    });
    expect(result.current[0].name).toBe('other manager updated');

    unmount();
    unsubscribe();
    listener.mockClear();
    expect(otherManager.remove()).toBe(true);
    expect(manager.get()).toBe(defaultValue);
    expect(listener).not.toHaveBeenCalled();
  });

  it.each(adapters)(
    'hydrates %s defaults before switching to the saved value',
    async (_, createManager) => {
      const manager = createManager();
      expect(manager.set({ name: 'saved in browser' })).toBe(true);

      function Settings() {
        const [settings] = useStorage(manager);
        return <span>{settings.name}</span>;
      }

      const container = document.createElement('div');
      container.innerHTML = renderToString(<Settings />);
      expect(container.textContent).toBe('default');

      const onRecoverableError = vi.fn();
      const root = hydrateRoot(container, <Settings />, { onRecoverableError });
      try {
        await act(async () => {});
        expect(onRecoverableError).not.toHaveBeenCalled();
        expect(container.textContent).toBe('saved in browser');
      } finally {
        act(() => root.unmount());
      }
    }
  );

  it('syncs local storage across tabs via storage events', () => {
    const manager = createLocalStorage('settings', 'default');
    const { result } = renderHook(() => useStorage(manager));

    act(() => {
      // Simulate external localStorage update
      window.localStorage.setItem('settings', JSON.stringify('external update'));
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'settings',
          newValue: JSON.stringify('external update'),
        })
      );
    });

    expect(result.current[0]).toBe('external update');
  });

  it('ignores sessionStorage changes and refreshes when another tab clears localStorage', () => {
    const manager = createLocalStorage('settings', 'default');
    manager.set('saved');
    const { result } = renderHook(() => useStorage(manager));

    act(() => {
      window.localStorage.clear();
      window.dispatchEvent(new StorageEvent('storage', { storageArea: window.sessionStorage }));
    });
    expect(result.current[0]).toBe('saved');

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { storageArea: window.localStorage }));
    });
    expect(result.current[0]).toBe('default');
  });

  it('falls back when the browser denies access to localStorage', () => {
    const event = new StorageEvent('storage', {
      key: 'settings',
      storageArea: window.localStorage,
    });
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const storage = vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError');
    });

    const manager = createLocalStorage('settings', 'default');
    const listener = vi.fn();
    const unsubscribe = manager.subscribe(listener);
    try {
      expect(manager.get()).toBe('default');
      expect(manager.set('unsaved')).toBe(false);
      expect(manager.remove()).toBe(false);
      window.dispatchEvent(event);
      expect(listener).not.toHaveBeenCalled();
    } finally {
      unsubscribe();
      storage.mockRestore();
      log.mockRestore();
    }
  });
});
