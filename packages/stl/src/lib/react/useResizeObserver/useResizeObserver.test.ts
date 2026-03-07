import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { useResizeObserver } from './useResizeObserver';

describe('useResizeObserver', () => {
  let observerCallback: ResizeObserverCallback;
  const observeMock = vi.fn();
  const unobserveMock = vi.fn();
  const disconnectMock = vi.fn();

  beforeEach(() => {
    class MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        observerCallback = callback;
      }
      observe = observeMock;
      unobserve = unobserveMock;
      disconnect = disconnectMock;
    }

    vi.stubGlobal('ResizeObserver', MockResizeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('should return initial dimensions', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useResizeObserver(ref));
    expect(result.current).toEqual({ width: 0, height: 0 });
  });

  it('should call observe on mount', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    renderHook(() => useResizeObserver(ref));

    expect(observeMock).toHaveBeenCalledWith(element);
  });

  it('should update dimensions when ResizeObserver triggers', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    const { result } = renderHook(() => useResizeObserver(ref));

    const entries = [
      {
        contentRect: { width: 100, height: 200 },
        target: element,
      },
    ] as unknown as ResizeObserverEntry[];

    act(() => {
      observerCallback(entries, {} as ResizeObserver);
    });

    expect(result.current).toEqual({ width: 100, height: 200 });
  });

  it('should call disconnect on unmount', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    const { unmount } = renderHook(() => useResizeObserver(ref));

    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });

  it('should not observe if ref is null', () => {
    const ref = { current: null };
    renderHook(() => useResizeObserver(ref));

    expect(observeMock).not.toHaveBeenCalled();
  });
});
