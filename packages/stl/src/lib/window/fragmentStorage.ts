import { createStorageSnapshot, parseStoredJson, StorageCapacityError } from '../storage';

import type { PersistentStorage } from '../storage';

/** Configures how a fragment namespace is serialized. */
export interface FragmentStorageOptions {
  /** Removes obsolete URL query keys when writing or building a share URL. */
  omitSearchParams?: readonly string[];
}

/** Selects how a fragment write affects browser history. */
export interface FragmentStorageWriteOptions {
  /** Replaces the current entry by default. Use `push` to create a history checkpoint. */
  history?: 'replace' | 'push';
}

/** A storage manager backed by one namespace in the URL fragment. */
export interface FragmentStorage<T> extends PersistentStorage<T> {
  /** Builds a share URL without changing browser history. Omit the value to clear the payload. */
  buildUrl: (value?: T) => string | undefined;
  /** Writes the fragment and optionally creates a browser history checkpoint. */
  set: (value: T | ((prev: T) => T), options?: FragmentStorageWriteOptions) => boolean;
  /** Removes the namespaced fragment and optionally creates a browser history checkpoint. */
  remove: (options?: FragmentStorageWriteOptions) => boolean;
}

const changeEvent = 'ermnvldmr:fragment-storage';
const maxFragmentBytes = 8 * 1024;

/**
 * Stores values in a fragment of the form `#namespace?~base64url#anchor`.
 *
 * The namespace owns the leading fragment payload. Any ordinary fragment following it,
 * as well as the path and URL query, is preserved when writing by default.
 *
 * @example
 * const settings = createFragmentStorage('settings', defaults);
 */
export function createFragmentStorage<T>(
  key: string,
  defaultValue: T,
  { omitSearchParams }: FragmentStorageOptions = {}
): FragmentStorage<T> {
  const prefix = `#${encodeURIComponent(key)}?`;

  /**
   * Separates the namespaced query from the ordinary anchor.
   *
   * @example
   * const { query, anchor } = readFragment(window.location.hash);
   */
  function readFragment(hash: string): { query: string | null; anchor: string } {
    if (!hash.startsWith(prefix)) return { query: null, anchor: hash };

    const fragment = hash.slice(prefix.length);
    const anchorIndex = fragment.indexOf('#');
    if (anchorIndex === -1) return { query: fragment, anchor: '' };
    return { query: fragment.slice(0, anchorIndex), anchor: fragment.slice(anchorIndex) };
  }

  const get = createStorageSnapshot(
    () => {
      if (typeof window === 'undefined') return null;
      const { hash } = window.location;
      return hash.length <= maxFragmentBytes ? readFragment(hash).query : null;
    },
    (query) => {
      try {
        if (!query.startsWith('~')) return parseStoredJson<T>(decodeURIComponent(query));

        const binary = atob(query.slice(1).replace(/-/g, '+').replace(/_/g, '/'));
        const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
        return parseStoredJson<T>(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
      } catch {
        return undefined;
      }
    },
    defaultValue
  );

  /**
   * Combines the encoded settings with the current page URL.
   *
   * @example
   * const url = buildFragmentUrl('~ImxpZ2h0Ig');
   */
  function buildFragmentUrl(query: string): string {
    const { href, hash } = window.location;
    const { anchor } = readFragment(hash);
    const fragment = query ? `${prefix}${query}${anchor}` : anchor;
    if (query && fragment.length > maxFragmentBytes) {
      throw new StorageCapacityError(maxFragmentBytes);
    }
    const url = new URL(href);
    url.hash = '';
    for (const param of omitSearchParams ?? []) {
      if (url.searchParams.has(param)) url.searchParams.delete(param);
    }
    return `${url.href}${fragment}`;
  }

  /**
   * Updates browser history and notifies other managers in this document.
   *
   * @example
   * const saved = write(url, { history: 'push' });
   */
  function write(url: string, options?: FragmentStorageWriteOptions): boolean {
    const { history, location } = window;
    if (options?.history === 'push') {
      history.pushState(history.state, '', url);
    } else {
      if (url === location.href) return true;
      history.replaceState(history.state, '', url);
    }
    window.dispatchEvent(new Event(changeEvent));
    return true;
  }

  /** Serializes a value before placing it in the fragment.
   *
   * @example
   * const payload = serialize({ count: 1 });
   */
  function serialize(value: T): string {
    const json: unknown = JSON.stringify(value);
    if (typeof json !== 'string') throw new TypeError('Storage values must be JSON-serializable.');
    const bytes = new TextEncoder().encode(json);
    // Unpadded Base64 uses ceil(4n/3) characters. Check before spreading the bytes.
    if (prefix.length + 1 + Math.ceil((bytes.byteLength * 4) / 3) > maxFragmentBytes) {
      throw new StorageCapacityError(maxFragmentBytes);
    }
    const encoded = btoa(String.fromCharCode(...bytes));
    return `~${encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`;
  }

  return {
    key,
    get,
    getServerSnapshot: () => defaultValue,
    subscribe: (listener) => {
      if (typeof window === 'undefined') return () => undefined;

      window.addEventListener(changeEvent, listener);
      window.addEventListener('hashchange', listener);
      window.addEventListener('popstate', listener);
      return () => {
        window.removeEventListener(changeEvent, listener);
        window.removeEventListener('hashchange', listener);
        window.removeEventListener('popstate', listener);
      };
    },
    buildUrl: (value) => {
      if (typeof window === 'undefined') return undefined;

      try {
        return buildFragmentUrl(value === undefined ? '' : serialize(value));
      } catch {
        return undefined;
      }
    },
    set: (value, options) => {
      if (typeof window === 'undefined') return false;

      try {
        const next = value instanceof Function ? value(get()) : value;
        return write(buildFragmentUrl(serialize(next)), options);
      } catch (error) {
        if (error instanceof StorageCapacityError) throw error;
        return false;
      }
    },
    remove: (options) => {
      if (typeof window === 'undefined') return false;

      try {
        return write(buildFragmentUrl(''), options);
      } catch {
        return false;
      }
    },
  };
}
