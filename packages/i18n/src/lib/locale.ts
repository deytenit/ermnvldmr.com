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
