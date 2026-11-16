import { waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createFragmentStorage } from './fragmentStorage';
import { StorageCapacityError } from '../storage';

const fallback = { count: 0 };

function createManager() {
  return createFragmentStorage('counter', fallback);
}

describe('fragment storage', () => {
  beforeEach(() => {
    window.history.replaceState({ existing: true }, '', '/doc?keep=%20#section');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('replaces the namespace and preserves the query, anchor, and history state', () => {
    const manager = createManager();
    const initialLength = window.history.length;
    const share = manager.buildUrl({ count: 3 });
    expect(share).toBe(`${window.location.origin}/doc?keep=%20#counter?~eyJjb3VudCI6M30#section`);
    expect(window.location.hash).toBe('#section');
    expect(manager.set({ count: 3 })).toBe(true);
    expect(window.location.href).toBe(share);
    expect(window.history.length).toBe(initialLength);
    expect(window.history.state).toEqual({ existing: true });

    expect(manager.remove()).toBe(true);
    expect(window.location.hash).toBe('#section');
    expect(window.location.search).toBe('?keep=%20');
  });

  it('omits only configured query keys from share URLs and browser writes', () => {
    window.history.replaceState(null, '', '/doc?old=one&keep=yes&old=two#section');
    const manager = createFragmentStorage('counter', fallback, { omitSearchParams: ['old'] });

    const shareUrl = manager.buildUrl({ count: 4 });
    expect(shareUrl).toBe(
      `${window.location.origin}/doc?keep=yes#counter?~eyJjb3VudCI6NH0#section`
    );
    expect(manager.set({ count: 4 })).toBe(true);
    expect(window.location.href).toBe(shareUrl);
  });

  it('returns defaults for malformed fragment values', () => {
    const manager = createManager();
    window.history.replaceState(null, '', '#counter?%7B');
    expect(manager.get()).toBe(fallback);
    window.history.replaceState(null, '', '#counter?~_w');
    expect(manager.get()).toBe(fallback);
  });

  it('reads previously shared percent-encoded JSON', () => {
    const manager = createManager();
    window.history.replaceState(null, '', '#counter?%7B%22count%22%3A3%7D#section');
    expect(manager.get()).toEqual({ count: 3 });
  });

  it('round trips nested JSON values and unicode without a codec', () => {
    const manager = createFragmentStorage<unknown>('settings', null);
    const value = { title: 'café #?&% 🧪', options: [false, 2, null, { enabled: true }] };
    expect(manager.set(value)).toBe(true);
    expect(manager.get()).toEqual(value);
    expect(manager.buildUrl()).toBe(`${window.location.origin}/doc?keep=%20#section`);
  });

  it('rejects values that JSON cannot serialize without changing the URL', () => {
    const manager = createFragmentStorage<unknown>('settings', null);
    const originalUrl = window.location.href;
    expect(manager.set(1n)).toBe(false);
    expect(manager.set(undefined)).toBe(false);
    expect(manager.buildUrl(1n)).toBeUndefined();
    expect(window.location.href).toBe(originalUrl);
    expect(manager.get()).toBeNull();
  });

  it('limits the encoded fragment size before writing or copying it', () => {
    window.history.replaceState(null, '', '/doc?keep=%20');
    const manager = createFragmentStorage('settings0', '');
    const prefix = '#settings0?~';
    const atLimit = 'a'.repeat(((8 * 1024 - prefix.length) * 3) / 4 - 2);
    expect(manager.set(atLimit)).toBe(true);
    expect(window.location.hash).toHaveLength(8 * 1024);
    const savedUrl = window.location.href;
    const listener = vi.fn();
    const unsubscribe = manager.subscribe(listener);

    try {
      expect(() => manager.set((value) => value + 'é')).toThrow(StorageCapacityError);
      expect(manager.buildUrl(atLimit + 'é')).toBeUndefined();
      expect(window.location.href).toBe(savedUrl);
      expect(manager.get()).toBe(atLimit);
      expect(listener).not.toHaveBeenCalled();
      const oversized = btoa(JSON.stringify(atLimit + 'a')).replace(/=+$/, '');
      window.history.replaceState(null, '', `${prefix}${oversized}#section`);
      expect(manager.get()).toBe('');
    } finally {
      unsubscribe();
    }
  });

  it('counts the preserved fragment when another namespace writes', () => {
    const first = createFragmentStorage('first', '');
    const second = createFragmentStorage('second', '');
    const value = 'a'.repeat(4400);
    expect(first.set(value)).toBe(true);
    const savedUrl = window.location.href;

    expect(() => second.set(value)).toThrow(StorageCapacityError);
    expect(second.buildUrl(value)).toBeUndefined();
    expect(window.location.href).toBe(savedUrl);
    expect(first.get()).toBe(value);

    window.history.replaceState(null, '', savedUrl + 'z'.repeat(4000));
    expect(first.get()).toBe('');
  });

  it('reports rejected writes while still building a share URL', () => {
    const manager = createManager();
    manager.set({ count: 2 });
    const listener = vi.fn();
    const unsubscribe = manager.subscribe(listener);
    const previousUrl = window.location.href;

    vi.spyOn(window.history, 'replaceState').mockImplementation(() => {
      throw new DOMException('History update rejected', 'SecurityError');
    });
    expect(manager.set({ count: 7 })).toBe(false);
    expect(manager.remove()).toBe(false);
    expect(manager.get()).toEqual({ count: 2 });
    expect(window.location.href).toBe(previousUrl);
    expect(listener).not.toHaveBeenCalled();
    expect(manager.buildUrl({ count: 7 })).toContain('#counter?~eyJjb3VudCI6N30#section');
    unsubscribe();
  });

  it('restores snapshots on Back, Forward, and hash navigation', async () => {
    const manager = createManager();
    const listener = vi.fn(manager.get);
    const unsubscribe = manager.subscribe(listener);
    manager.set({ count: 1 });
    manager.set({ count: 1 }, { history: 'push' });
    manager.set({ count: 2 });

    try {
      window.history.back();
      await waitFor(() => expect(listener).toHaveLastReturnedWith({ count: 1 }));
      window.history.forward();
      await waitFor(() => expect(listener).toHaveLastReturnedWith({ count: 2 }));
      window.location.hash = '#other';
      await waitFor(() => expect(listener).toHaveLastReturnedWith(fallback));
    } finally {
      unsubscribe();
    }
  });

  it('uses defaults and rejects writes without a window', () => {
    vi.stubGlobal('window', undefined);
    const manager = createManager();
    expect(manager.get()).toBe(fallback);
    expect(manager.getServerSnapshot()).toBe(fallback);
    expect(manager.set({ count: 2 })).toBe(false);
    expect(manager.remove()).toBe(false);
    expect(manager.buildUrl({ count: 2 })).toBeUndefined();
  });
});
