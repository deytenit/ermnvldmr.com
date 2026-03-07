import { createLocalStorage } from '@ermnvldmr/stl';

/**
 * Valid theme preferences.
 */
export type ThemePreference = 'light' | 'dark' | 'system';

/**
 * The storage manager for the user's theme preference.
 * Follows the strict namespacing convention: ermnvldmr/{package}/{path}/{module}
 */
export const themeStorage = createLocalStorage<ThemePreference>('ermnvldmr/ui/lib/theme', 'system');
