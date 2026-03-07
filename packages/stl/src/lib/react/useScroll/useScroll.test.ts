import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { useScroll } from './useScroll';

describe('useScroll', () => {
  const originalScrollX = window.scrollX;
  const originalScrollY = window.scrollY;

  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      return setTimeout(callback, 0);
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    window.scrollX = originalScrollX;
    window.scrollY = originalScrollY;
  });

  it('should return initial scroll position', () => {
    window.scrollX = 50;
    window.scrollY = 150;
    const { result } = renderHook(() => useScroll());
    expect(result.current).toEqual({ x: 50, y: 150 });
  });

  it('should update scroll position on scroll', () => {
    const { result } = renderHook(() => useScroll());

    act(() => {
      window.scrollX = 100;
      window.scrollY = 200;
      window.dispatchEvent(new Event('scroll'));
    });

    // Wait for requestAnimationFrame (mocked via setTimeout)
    act(() => {
      vi.runAllTimers();
    });

    expect(result.current).toEqual({ x: 100, y: 200 });
  });

  it('should throttle updates using requestAnimationFrame', () => {
    const { result } = renderHook(() => useScroll());

    act(() => {
      window.scrollX = 100;
      window.scrollY = 200;
      window.dispatchEvent(new Event('scroll'));

      window.scrollX = 300;
      window.scrollY = 400;
      window.dispatchEvent(new Event('scroll'));
    });

    // Before timers run, it should still be initial or first set if not throttled correctly
    // But since we trigger twice in same tick, ticking.current prevents second RAF.

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current).toEqual({ x: 300, y: 400 });
  });
});
