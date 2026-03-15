import { LOCALE, LOCALES, type Locale } from './locale.js';

/**
 * Resolves any href value to its locale-aware form.
 *
 * Only absolute internal paths (starting with `/`) are rewritten; everything else
 * (external URLs, mailto/tel, relative paths, hash anchors) passes through unchanged.
 * The function is idempotent: paths already carrying any known locale prefix are returned as-is.
 *
 * Works identically in dev and production: the dev server is configured with
 * `server.base = /${LOCALE}` via `localeRsbuildConfig`.
 *
 * @param href - The href value to resolve.
 * @returns The locale-prefixed href, or the original value when no rewrite is needed.
 * @example
 * // LOCALE = 'en'
 * localePath('/articles')          // → '/en/articles'
 * localePath('/')                  // → '/en/'
 * localePath('/en/articles')       // → '/en/articles'  (idempotent)
 * localePath('https://github.com') // → 'https://github.com'  (external)
 * localePath('mailto:a@b.com')     // → 'mailto:a@b.com'
 * localePath('#section')           // → '#section'
 */
export function localePath(href: string): string;
export function localePath(href: null): null;
export function localePath(href: undefined): undefined;
export function localePath(href: string | undefined): string | undefined;
export function localePath(href: string | null): string | null;
export function localePath(href: string | null | undefined): string | null | undefined;
export function localePath(href: string | null | undefined): string | null | undefined {
  if (href == null) return href;
  if (!href.startsWith('/')) return href;
  if (LOCALES.some((l) => href === `/${l}` || href === `/${l}/` || href.startsWith(`/${l}/`))) {
    return href;
  }
  if (href === '/') return `/${LOCALE}/`;
  return `/${LOCALE}${href}`;
}

/**
 * Builds a URL for a specific locale given the current locale-prefixed URL.
 *
 * @param currentPath - The current page path, e.g. `/en/articles`.
 * @param locale - The target locale.
 * @returns The equivalent path for `locale`, e.g. `/ru/articles`.
 * @example
 * localeHref('/en/articles', 'ru') // → '/ru/articles'
 * localeHref('/en/', 'ru')         // → '/ru/'
 */
export function localeHref(currentPath: string, locale: Locale): string {
  const localePrefix = new RegExp(`^\\/(${LOCALES.join('|')})(.*)`);
  const match = localePrefix.exec(currentPath);
  if (match) {
    return `/${locale}${match[2] || '/'}`;
  }
  return `/${locale}${currentPath}`;
}
