import { useEffect, useRef } from 'react';

/**
 * Options for {@link useSearchParams}.
 */
export interface UseSearchParamsOptions {
  /** Whether to remove watched parameters from the URL after invoking `callback` (defaults to `true`). */
  deleteOnAction?: boolean;
  /**
   * When `true` (default), `callback` is invoked only if every watched parameter is present in the URL.
   * When `false`, `callback` is invoked with whatever parameters are present.
   */
  strictMatch?: boolean;
}

/**
 * Normalizes a single parameter key or readonly list of keys into a readonly array.
 *
 * @template T - Union of watched search parameter keys.
 * @param params - Single parameter key or array of parameter keys.
 * @returns Readonly array of parameter keys.
 * @example
 * ```ts
 * normalizeParams('q'); // ['q']
 * ```
 */
function normalizeParams<T extends string>(params: T | readonly T[]): readonly T[] {
  return typeof params === 'string' ? [params] : params;
}

/**
 * Parses `window.location.search` into a plain key-value map.
 *
 * @returns Key-value map of all search parameters, or an empty object in SSR.
 * @example
 * ```ts
 * readSearchEntries(); // { q: 'hello', page: '2' }
 * ```
 */
function readSearchEntries(): Record<string, string> {
  if (typeof window === 'undefined' || !window.location.search) {
    return {};
  }

  const entries: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);
  for (const [key, value] of searchParams.entries()) {
    entries[key] = value;
  }

  return entries;
}

/**
 * Checks whether every watched key is present in `entries`.
 *
 * @template T - Union of watched search parameter keys.
 * @param watchedKeys - Parameter keys required for a strict match.
 * @param entries - Parsed search parameter entries.
 * @returns `true` if all watched keys exist as own properties of `entries`.
 * @example
 * ```ts
 * hasAllKeys(['a', 'b'], { a: '1', b: '2' }); // true
 * ```
 */
function hasAllKeys<T extends string>(
  watchedKeys: readonly T[],
  entries: Record<string, string>
): boolean {
  return watchedKeys.every((key) => Object.prototype.hasOwnProperty.call(entries, key));
}

/**
 * Removes watched parameters from `window.location.search` via `history.replaceState`,
 * preserving unrelated query parameters, pathname, and hash.
 *
 * @template T - Union of watched search parameter keys.
 * @param watchedKeys - Parameter keys to remove from the URL.
 * @example
 * ```ts
 * removeWatchedParams(['q']);
 * ```
 */
function removeWatchedParams<T extends string>(watchedKeys: readonly T[]): void {
  if (typeof window === 'undefined' || !window.location.search) {
    return;
  }

  const searchParams = new URLSearchParams(window.location.search);
  let removed = false;

  for (const key of watchedKeys) {
    if (searchParams.has(key)) {
      searchParams.delete(key);
      removed = true;
    }
  }

  if (!removed) {
    return;
  }

  const query = searchParams.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
  window.history.replaceState(window.history.state, '', nextUrl);
}

/**
 * A React hook that reads URL search parameters from `window.location.search`,
 * invokes `callback(entries)` when matched, and optionally strips watched parameters
 * from the URL.
 *
 * By default (`strictMatch: true`), `callback` only runs when every key in `params`
 * is present in the URL, guaranteeing `entries[key]` is a `string` for all `T`.
 * Set `strictMatch: false` to invoke `callback` even when some or all watched keys
 * are absent. Safe to call in SSR.
 *
 * @template T - Union of watched search parameter keys.
 * @param params - Single search parameter key or array of keys to watch.
 * @param callback - Invoked with all search parameter entries when the match condition is met.
 * @param options - Optional behavior configuration (`deleteOnAction`, `strictMatch`).
 *
 * @example
 * ```tsx
 * useSearchParams(['href', 'text'] as const, (entries) => {
 *   console.log(entries.href, entries.text);
 * });
 * ```
 */
export function useSearchParams<T extends string>(
  params: T | readonly T[],
  callback: (entries: Record<T, string> & Record<string, string>) => void,
  options?: UseSearchParamsOptions & { strictMatch?: true }
): void;

/**
 * Non-strict overload of {@link useSearchParams} where watched keys may be `undefined`.
 *
 * @template T - Union of watched search parameter keys.
 * @param params - Single search parameter key or array of keys to watch.
 * @param callback - Invoked with search parameter entries where watched keys may be absent.
 * @param options - Configuration with `strictMatch: false`.
 * @example
 * ```tsx
 * useSearchParams(['href', 'text'] as const, (entries) => {
 *   console.log(entries.href ?? '');
 * }, { strictMatch: false });
 * ```
 */
export function useSearchParams<T extends string>(
  params: T | readonly T[],
  callback: (entries: Partial<Record<T, string>> & Record<string, string | undefined>) => void,
  options: UseSearchParamsOptions & { strictMatch: false }
): void;

/**
 * Implementation of {@link useSearchParams}.
 *
 * @template T - Union of watched search parameter keys.
 * @param params - Single search parameter key or array of keys to watch.
 * @param callback - Invoked with search parameter entries.
 * @param options - Optional behavior configuration (`deleteOnAction`, `strictMatch`).
 * @example
 * ```tsx
 * useSearchParams('token', (entries) => {
 *   console.log(entries.token);
 * });
 * ```
 */
export function useSearchParams<T extends string>(
  params: T | readonly T[],
  callback:
    | ((entries: Record<T, string> & Record<string, string>) => void)
    | ((entries: Partial<Record<T, string>> & Record<string, string | undefined>) => void),
  options: UseSearchParamsOptions = {}
): void {
  const { deleteOnAction = true, strictMatch = true } = options;
  const watchedKeys = normalizeParams(params);
  const paramSignature = watchedKeys.join('\0');

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const watchedKeysRef = useRef(watchedKeys);
  watchedKeysRef.current = watchedKeys;

  useEffect(() => {
    const processSearchParams = (): void => {
      const entries = readSearchEntries();
      if (strictMatch && !hasAllKeys(watchedKeysRef.current, entries)) {
        return;
      }

      callbackRef.current(entries);

      if (deleteOnAction) {
        removeWatchedParams(watchedKeysRef.current);
      }
    };

    processSearchParams();

    window.addEventListener('popstate', processSearchParams);
    return () => {
      window.removeEventListener('popstate', processSearchParams);
    };
  }, [deleteOnAction, paramSignature, strictMatch]);
}
