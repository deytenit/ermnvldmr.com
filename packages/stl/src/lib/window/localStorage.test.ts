import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { createLocalStorage } from './localStorage';

describe('lib/window/localStorage', () => {
  const mockStorage: Record<string, string> = {};
  const KEY = 'ermnvldmr/stl/lib/window/test';
  const DEFAULT_VALUE = { foo: 'bar' };

  const getItem = vi.fn((key: string) => mockStorage[key] || null);
  const setItem = vi.fn((key: string, value: string) => {
    mockStorage[key] = value;
  });
  const removeItem = vi.fn((key: string) => {
    delete mockStorage[key];
  });

  beforeEach(() => {
    getItem.mockClear();
    setItem.mockClear();
    removeItem.mockClear();

    // Mock localStorage
    vi.stubGlobal('window', {
      localStorage: {
        getItem,
        setItem,
        removeItem,
      },
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal('StorageEvent', class {
      constructor(type: string, init: any) {
        Object.assign(this, { type, ...init });
      }
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    for (const key in mockStorage) delete mockStorage[key];
  });

  it('should throw if window is undefined', () => {
    vi.stubGlobal('window', undefined);
    expect(() => createLocalStorage(KEY, DEFAULT_VALUE)).toThrow();
  });

  it('should get default value if empty', () => {
    const manager = createLocalStorage(KEY, DEFAULT_VALUE);
    expect(manager.get()).toEqual(DEFAULT_VALUE);
  });

  it('should set and get values', () => {
    const manager = createLocalStorage(KEY, DEFAULT_VALUE);
    const newValue = { foo: 'updated' };
    manager.set(newValue);
    expect(manager.get()).toEqual(newValue);
    expect(setItem).toHaveBeenCalledWith(KEY, JSON.stringify(newValue));
  });

  it('should support functional updates', () => {
    const manager = createLocalStorage(KEY, 0);
    manager.set((prev) => prev + 1);
    expect(manager.get()).toBe(1);
    manager.set((prev) => prev + 1);
    expect(manager.get()).toBe(2);
  });

  it('should remove items', () => {
    const manager = createLocalStorage(KEY, DEFAULT_VALUE);
    manager.set({ foo: 'baz' });
    manager.remove();
    expect(manager.get()).toEqual(DEFAULT_VALUE);
    expect(removeItem).toHaveBeenCalledWith(KEY);
  });

  it('should dispatch storage event on set', () => {
    const manager = createLocalStorage(KEY, DEFAULT_VALUE);
    manager.set({ foo: 'event' });
    expect(window.dispatchEvent).toHaveBeenCalled();
  });

  it('should fallback to default value on parse error', () => {
    mockStorage[KEY] = 'invalid-json';
    const manager = createLocalStorage(KEY, DEFAULT_VALUE);
    expect(manager.get()).toEqual(DEFAULT_VALUE);
  });
});
