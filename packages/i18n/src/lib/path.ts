import { LOCALE, LOCALES, type Locale } from './locale.js';

/**
 * Prepends the current build locale to an absolute path.
 *
 * - Production (SSG): returns `/${LOCALE}${path}` so links match the deployed
 *   locale-prefixed directory structure.
 * - Development: returns the plain path because Rsbuild's dev server routes
 *   entries without an `assetPrefix` (the prefix applies only to static assets).
 *
 * @example
 * // production, LOCALE = 'en'
 * localePath('/articles') → '/en/articles'
 * localePath('/')         → '/en/'
 *
 * // development
 * localePath('/articles') → '/articles'
 * localePath('/')         → '/'
 */
export function localePath(path: string): string {
  if (process.env.NODE_ENV === 'development') {
    return path;
  }
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
