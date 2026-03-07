import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { useIntersectionObserver } from './useIntersectionObserver';

describe('useIntersectionObserver', () => {
  let observerCallback: IntersectionObserverCallback;
  let observeMock = vi.fn();
  let unobserveMock = vi.fn();
  let disconnectMock = vi.fn();

  beforeEach(() => {
    observeMock = vi.fn();
    unobserveMock = vi.fn();
    disconnectMock = vi.fn();

    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        observerCallback = callback;
        this.root = options?.root ?? null;
        this.rootMargin = options?.rootMargin ?? '';
        this.thresholds = options?.threshold
          ? Array.isArray(options.threshold)
            ? options.threshold
            : [options.threshold]
          : [0];
      }
      root: Element | Document | null;
      rootMargin: string;
      thresholds: readonly number[];
      takeRecords = vi.fn();
      observe = observeMock;
      unobserve = unobserveMock;
      disconnect = disconnectMock;
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('should return initial state as not intersecting', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useIntersectionObserver(ref));
    expect(result.current).toBe(false);
  });

  it('should call observe on mount', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    renderHook(() => useIntersectionObserver(ref));

    expect(observeMock).toHaveBeenCalledWith(element);
  });

  it('should update isIntersecting when observer triggers', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    const { result } = renderHook(() => useIntersectionObserver(ref));

    const entries = [
      {
        isIntersecting: true,
        target: element,
      },
    ] as unknown as IntersectionObserverEntry[];

    act(() => {
      observerCallback(entries, {} as IntersectionObserver);
    });

    expect(result.current).toBe(true);
  });

  it('should disconnect after first intersection if once is true', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    renderHook(() => useIntersectionObserver(ref, { once: true }));

    const entries = [
      {
        isIntersecting: true,
        target: element,
      },
    ] as unknown as IntersectionObserverEntry[];

    act(() => {
      observerCallback(entries, {} as IntersectionObserver);
    });

    expect(disconnectMock).toHaveBeenCalled();
  });

  it('should not disconnect after first intersection if once is false', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    renderHook(() => useIntersectionObserver(ref, { once: false }));

    const entries = [
      {
        isIntersecting: true,
        target: element,
      },
    ] as unknown as IntersectionObserverEntry[];

    act(() => {
      observerCallback(entries, {} as IntersectionObserver);
    });

    expect(disconnectMock).not.toHaveBeenCalled();
  });

  it('should call disconnect on unmount', () => {
    const element = document.createElement('div');
    const ref = { current: element };
    const { unmount } = renderHook(() => useIntersectionObserver(ref));

    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });

  it('should not observe if ref is null', () => {
    const ref = { current: null };
    renderHook(() => useIntersectionObserver(ref));

    expect(observeMock).not.toHaveBeenCalled();
  });

  it('should return true immediately if IntersectionObserver is not available', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useIntersectionObserver(ref));
    expect(result.current).toBe(true);
  });
});
