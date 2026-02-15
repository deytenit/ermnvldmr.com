import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { useLocalStorage } from './useLocalStorage';
import { createLocalStorage } from '../../window/localStorage';

describe('lib/react/useLocalStorage', () => {
  const KEY = 'ermnvldmr/stl/lib/react/useLocalStorage/test';
  const DEFAULT_VALUE = 'default';

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return default value initially', () => {
    const manager = createLocalStorage(KEY, DEFAULT_VALUE);
    const { result } = renderHook(() => useLocalStorage(manager));
    expect(result.current[0]).toBe(DEFAULT_VALUE);
  });

  it('should update state when setter is called', () => {
    const manager = createLocalStorage(KEY, DEFAULT_VALUE);
    const { result } = renderHook(() => useLocalStorage(manager));
    
    act(() => {
      result.current[1]('new value');
    });
    
    expect(result.current[0]).toBe('new value');
    expect(window.localStorage.getItem(KEY)).toBe(JSON.stringify('new value'));
  });

  it('should sync across tabs via storage event', () => {
    const manager = createLocalStorage(KEY, DEFAULT_VALUE);
    const { result } = renderHook(() => useLocalStorage(manager));

    act(() => {
      // Simulate external localStorage update
      window.localStorage.setItem(KEY, JSON.stringify('external update'));
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: KEY,
          newValue: JSON.stringify('external update'),
        })
      );
    });

    expect(result.current[0]).toBe('external update');
  });

  it('should support functional updates', () => {
    const manager = createLocalStorage(KEY, 0);
    const { result } = renderHook(() => useLocalStorage(manager));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });
});
