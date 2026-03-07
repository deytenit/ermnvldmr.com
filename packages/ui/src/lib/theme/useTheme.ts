import { useLocalStorage } from '@ermnvldmr/stl';
import { useEffect, useCallback } from 'react';

import { themeStorage } from './storage';

import type { ThemePreference } from './storage';

/**
 * Result of the useTheme hook.
 */
export interface UseThemeResult {
  /** The current theme preference ('light', 'dark', or 'system') */
  preference: ThemePreference;
  /** Update the theme preference */
  setPreference: (value: ThemePreference) => void;
  /** The theme actually applied to the UI ('light' or 'dark') */
  resolvedTheme: 'light' | 'dark';
}

/**
 * A hook for managing and synchronizing the application theme.
 *
 * It handles the DOM class updates, localStorage persistence, and
 * listens for system preference changes when in 'system' mode.
 *
 * @returns An object containing the current preference and setter.
 * @example
 * ```tsx
 * const { preference, setPreference } = useTheme();
 * ```
 */
export function useTheme(): UseThemeResult {
  const [preference, setPreference] = useLocalStorage(themeStorage);

  const resolveTheme = useCallback((pref: ThemePreference): 'light' | 'dark' => {
    if (pref !== 'system') return pref;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // During hydration, we want to match what's already on the document
  const initialTheme =
    typeof window !== 'undefined'
      ? window.document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light'
      : 'light';

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = resolveTheme(preference) === 'dark';

    // Only toggle if it doesn't match to avoid redundant layout shifts
    if (root.classList.contains('dark') !== isDark) {
      root.classList.toggle('dark', isDark);
    }

    if (preference === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (): void => {
        root.classList.toggle('dark', mediaQuery.matches);
      };

      mediaQuery.addEventListener('change', listener);
      return () => {
        mediaQuery.removeEventListener('change', listener);
      };
    }

    return undefined;
  }, [preference, resolveTheme]);

  return {
    preference,
    setPreference,
    resolvedTheme: typeof window !== 'undefined' ? resolveTheme(preference) : initialTheme,
  };
}
