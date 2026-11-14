import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSearchParams } from './useSearchParams';

describe('useSearchParams', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState(null, '', '/');
  });

  it('invokes callback when a single watched param is present and deletes it by default', () => {
    window.history.replaceState(null, '', '/anchorer?token=abc123&utm=feed#section');
    const callback = vi.fn();

    renderHook(() => useSearchParams('token', callback));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ token: 'abc123', utm: 'feed' });
    expect(window.location.pathname).toBe('/anchorer');
    expect(window.location.search).toBe('?utm=feed');
    expect(window.location.hash).toBe('#section');
  });

  it('invokes callback only when all watched params are present under default strictMatch', () => {
    window.history.replaceState(null, '', '/?href=https://example.com&extra=1');
    const replaceSpy = vi.spyOn(window.history, 'replaceState');
    const callback = vi.fn();

    renderHook(() => useSearchParams(['href', 'text'] as const, callback));

    expect(callback).not.toHaveBeenCalled();
    expect(replaceSpy).not.toHaveBeenCalled();
    expect(window.location.search).toBe('?href=https://example.com&extra=1');
  });

  it('invokes callback and deletes all watched params when every watched key matches', () => {
    window.history.replaceState(null, '', '/page?a=1&b=2#top');
    const callback = vi.fn();

    renderHook(() => useSearchParams(['a', 'b'] as const, callback));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({ a: '1', b: '2' });
    expect(window.location.pathname).toBe('/page');
    expect(window.location.search).toBe('');
    expect(window.location.hash).toBe('#top');
  });

  it('invokes callback with partial entries when strictMatch is false', () => {
    window.history.replaceState(null, '', '/?href=https://example.com&extra=1');
    const callback = vi.fn();

    renderHook(() =>
      useSearchParams(['href', 'text'] as const, callback, { strictMatch: false })
    );

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      href: 'https://example.com',
      extra: '1',
    });
    expect(window.location.search).toBe('?extra=1');
  });

  it('invokes callback with empty entries when strictMatch is false and search is empty', () => {
    const replaceSpy = vi.spyOn(window.history, 'replaceState');
    const callback = vi.fn();

    renderHook(() => useSearchParams(['href'] as const, callback, { strictMatch: false }));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({});
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it('keeps watched params in the URL when deleteOnAction is false', () => {
    window.history.replaceState(null, '', '/?href=https://example.com&keep=yes');
    const replaceSpy = vi.spyOn(window.history, 'replaceState');
    const callback = vi.fn();

    renderHook(() => useSearchParams('href', callback, { deleteOnAction: false }));

    expect(callback).toHaveBeenCalledWith({
      href: 'https://example.com',
      keep: 'yes',
    });
    expect(window.location.search).toBe('?href=https://example.com&keep=yes');
    expect(replaceSpy).not.toHaveBeenCalled();
  });

  it('re-evaluates on popstate navigation and uses the latest callback', () => {
    window.history.replaceState(null, '', '/?step=one');
    let multiplier = 1;
    const seen: string[] = [];

    const { rerender } = renderHook(() =>
      useSearchParams('step', (entries) => {
        seen.push(`${entries.step}:${multiplier}`);
      })
    );

    expect(seen).toEqual(['one:1']);
    expect(window.location.search).toBe('');

    multiplier = 2;
    rerender();

    act(() => {
      window.history.replaceState(null, '', '/?step=two&keep=ok');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(seen).toEqual(['one:1', 'two:2']);
    expect(window.location.search).toBe('?keep=ok');
  });

  it('re-evaluates when watched params list changes', () => {
    window.history.replaceState(null, '', '/?first=1&second=2');
    const callback = vi.fn();

    const { rerender } = renderHook(
      ({ keys }: { keys: readonly string[] }) =>
        useSearchParams(keys, callback, { deleteOnAction: false }),
      { initialProps: { keys: ['first'] } }
    );

    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ keys: ['second'] });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('returns void', () => {
    const { result } = renderHook(() =>
      useSearchParams('x', () => {
        // intentionally empty
      })
    );

    expect(result.current).toBeUndefined();
  });
});
