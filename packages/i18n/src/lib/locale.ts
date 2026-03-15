export type Locale = 'en' | 'ru';

export const LOCALES: readonly Locale[] = ['en', 'ru'] as const;

export const DEFAULT_LOCALE: Locale = 'en';

/**
 * The active locale for the current build.
 * Injected at compile time via source.define → process.env.LOCALE.
 * Falls back to DEFAULT_LOCALE in non-locale-aware builds (tests, Storybook).
 */
export const LOCALE: Locale =
  (process.env.LOCALE as Locale | undefined) ?? DEFAULT_LOCALE;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

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
  SWITCH_LABELS[LOCALE]?.[OTHER_LOCALE] ?? OTHER_LOCALE.toUpperCase();
