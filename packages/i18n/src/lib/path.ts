import { LOCALE, LOCALES, type Locale } from './locale.js';

/**
 * Prepends the current build locale to an absolute path.
 *
 * Works identically in dev and production: the dev server is configured with
 * `server.base = /${LOCALE}` via `localeRsbuildConfig`, so routes are always
 * served under the locale prefix in both environments.
 *
 * @example
 * // LOCALE = 'en'
 * localePath('/articles') → '/en/articles'
 * localePath('/')         → '/en/'
 */
export function localePath(path: string): string {
  if (path === '/') return `/${LOCALE}/`;
  return `/${LOCALE}${path}`;
}

/**
 * Builds a URL for a specific locale given the current URL.
 * e.g. localeHref('/en/articles', 'ru') → '/ru/articles'
 */
export function localeHref(currentPath: string, locale: Locale): string {
  const localePrefix = new RegExp(`^\\/(${LOCALES.join('|')})(.*)`);
  const match = currentPath.match(localePrefix);
  if (match) {
    return `/${locale}${match[2] || '/'}`;
  }
  return `/${locale}${currentPath}`;
}
