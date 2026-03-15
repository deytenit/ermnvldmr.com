import { LOCALE } from './locale.js';
import { pluralize, type PluralForms } from './pluralize.js';

import type { ReactNode } from 'react';

/** A translation entry with a plain string per locale. */
interface PlainTranslation { en: string; ru: string }

/** A translation entry with plural forms per locale. */
interface PluralTranslation { en: PluralForms; ru: PluralForms }

/** Union of all supported translation shapes. */
type Translation = PlainTranslation | PluralTranslation;

/** A map of translation keys to their translation entries. */
type Keyset = Record<string, Translation>;

/**
 * Returns `true` when the translation entry uses plural forms.
 *
 * @param t - The translation entry to inspect.
 * @returns Type predicate narrowing `t` to {@link PluralTranslation}.
 * @example
 * isPluralTranslation({ en: 'hello', ru: 'привет' }) // → false
 */
function isPluralTranslation(t: Translation): t is PluralTranslation {
  return typeof t.en === 'object';
}

/**
 * Replaces `{key}` placeholders in `template` with values from `params`.
 *
 * @param template - String containing `{key}` placeholders.
 * @param params - Map of placeholder names to string/number values.
 * @returns The interpolated string.
 * @example
 * interpolate('Hello {name}!', { name: 'World' }) // → 'Hello World!'
 */
function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in params ? String(params[key]) : `{${key}}`
  );
}

/**
 * Splits `template` on `{key}` placeholders and substitutes ReactNode values.
 *
 * @param template - String containing `{key}` placeholders.
 * @param params - Map of placeholder names to ReactNode values.
 * @returns A single string when all parts are strings, otherwise a ReactNode array.
 * @example
 * interpolateRaw('Click {link}', { link: <a href="/">here</a> })
 */
function interpolateRaw(template: string, params: Record<string, ReactNode>): ReactNode {
  const parts = template.split(/(\{[^}]+\})/g);
  const result = parts.map((part) => {
    const match = /^\{(\w+)\}$/.exec(part);
    if (match) {
      const key = match[1];
      return key in params ? params[key] : part;
    }
    return part;
  });
  if (result.every((p): p is string => typeof p === 'string')) {
    return result.join('');
  }
  return result;
}

/**
 * Creates a typed `t` and `tRaw` pair bound to `keyset`.
 *
 * @param keyset - An object mapping translation keys to their locale entries.
 * @returns `{ t, tRaw }` translation helpers.
 * @example
 * const { t } = createKeyset({ greeting: { en: 'Hello', ru: 'Привет' } });
 * t('greeting') // → 'Hello'  (in EN build)
 */
export function createKeyset<const K extends Keyset>(keyset: K) {
  /** String union of all keys defined in `keyset`. */
  type Keys = keyof K & string;

  /**
   * Returns the translated string for `key`, with optional interpolation and pluralisation.
   *
   * @param key - A key defined in the keyset.
   * @param params - Optional interpolation/pluralisation params.
   * @returns The translated string for the current build locale.
   * @example
   * t('greeting')                        // → 'Hello'
   * t('items {count}', { count: 3 })     // → '3 items'
   */
  function t(key: Keys, params?: Record<string, string | number>): string {
    const entry = keyset[key];

    if (isPluralTranslation(entry)) {
      const forms = entry[LOCALE];
      const count = typeof params?.count === 'number' ? params.count : 0;
      const template = pluralize(count, forms);
      return params ? interpolate(template, params) : template;
    }

    const template = entry[LOCALE];
    return params ? interpolate(template, params) : template;
  }

  /**
   * Returns the translated ReactNode for `key`, allowing ReactNode interpolation values.
   *
   * @param key - A key defined in the keyset.
   * @param params - Optional interpolation params; values may be any ReactNode.
   * @returns The translated string or ReactNode array for the current build locale.
   * @example
   * tRaw('click {link}', { link: <a href="/">here</a> })
   */
  function tRaw(key: Keys, params?: Record<string, ReactNode>): ReactNode {
    const entry = keyset[key];

    if (isPluralTranslation(entry)) {
      const forms = entry[LOCALE];
      const countParam = params?.count;
      const count = typeof countParam === 'number' ? countParam : 0;
      const template = pluralize(count, forms);
      return params ? interpolateRaw(template, params) : template;
    }

    const template = entry[LOCALE];
    return params ? interpolateRaw(template, params) : template;
  }

  return { t, tRaw };
}
