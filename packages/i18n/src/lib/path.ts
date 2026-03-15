import { LOCALE, LOCALES, type Locale } from './locale.js';

/**
 * Resolves any href value to its locale-aware form.
 *
 * - Absolute internal paths (`/...`) are prefixed with the current build locale.
 * - Everything else (external URLs, mailto/tel, relative paths, hash anchors)
 *   is returned unchanged.
 * - Idempotent: paths already carrying any known locale prefix are not modified.
 *
 * This means `localePath` can be called unconditionally on any `href` value —
 * no need for `href.startsWith('/')` guards at the call-site.
 *
 * Works identically in dev and production: the dev server is configured with
 * `server.base = /${LOCALE}` via `localeRsbuildConfig`.
 *
 * @example
 * // LOCALE = 'en'
 * localePath('/articles')          → '/en/articles'
 * localePath('/')                  → '/en/'
 * localePath('/en/articles')       → '/en/articles'   (idempotent)
 * localePath('https://github.com') → 'https://github.com'  (external, unchanged)
 * localePath('mailto:a@b.com')     → 'mailto:a@b.com'      (unchanged)
 * localePath('#section')           → '#section'             (unchanged)
 */
export function localePath(href: string): string;
export function localePath(href: null): null;
export function localePath(href: undefined): undefined;
export function localePath(href: string | undefined): string | undefined;
export function localePath(href: string | null): string | null;
export function localePath(href: string | null | undefined): string | null | undefined;
export function localePath(href: string | null | undefined): string | null | undefined {
  if (href == null) return href;
  // Only rewrite absolute internal paths.
  if (!href.startsWith('/')) return href;
  // Already carries any locale prefix — leave it alone.
  if (LOCALES.some((l) => href === `/${l}` || href === `/${l}/` || href.startsWith(`/${l}/`))) {
    return href;
  }
  if (href === '/') return `/${LOCALE}/`;
  return `/${LOCALE}${href}`;
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
