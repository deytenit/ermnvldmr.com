/** The supported locale identifiers. */
export type Locale = 'en' | 'ru';

export const LOCALES: readonly Locale[] = ['en', 'ru'] as const;

export const DEFAULT_LOCALE: Locale = 'en';

// Widened once so inclusion checks need no type assertions.
const LOCALES_STRINGS: readonly string[] = LOCALES;

/**
 * Returns `true` when `value` is a known {@link Locale} identifier.
 *
 * @param value - The string to test.
 * @returns Type predicate narrowing `value` to `Locale`.
 * @example
 * isLocale('en') // → true
 * isLocale('fr') // → false
 */
export function isLocale(value: string): value is Locale {
  return LOCALES_STRINGS.includes(value);
}

/**
 * The active locale for the current build.
 * Injected at compile time via source.define → process.env.LOCALE.
 * Falls back to DEFAULT_LOCALE in non-locale-aware builds (tests, Storybook).
 */
const rawLocale = process.env.LOCALE ?? '';
export const LOCALE: Locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

/**
 * The other (non-active) locale for the current build.
 * Constant-folded at build time.
 */
export const OTHER_LOCALE: Locale = LOCALES.find((l) => l !== LOCALE) ?? DEFAULT_LOCALE;

/**
 * Human-readable label for switching to the other locale,
 * expressed in the CURRENT locale's language.
 * - EN build → "In Russian"
 * - RU build → "На Английском"
 */
const SWITCH_LABELS: Record<Locale, Partial<Record<Locale, string>>> = {
  en: { ru: 'In Russian' },
  ru: { en: 'На Английском' },
};

export const OTHER_LOCALE_LABEL: string =
  SWITCH_LABELS[LOCALE][OTHER_LOCALE] ?? OTHER_LOCALE.toUpperCase();
