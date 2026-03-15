import type { ReactNode } from 'react';
import { LOCALE } from './locale.js';
import { pluralize, type PluralForms } from './pluralize.js';

type PlainTranslation = { en: string; ru: string };
type PluralTranslation = { en: PluralForms; ru: PluralForms };
type Translation = PlainTranslation | PluralTranslation;

type Keyset = Record<string, Translation>;

function isPluralTranslation(t: Translation): t is PluralTranslation {
  return typeof (t as PluralTranslation)[LOCALE] === 'object';
}

function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in params ? String(params[key]) : `{${key}}`
  );
}

function interpolateRaw(
  template: string,
  params: Record<string, ReactNode>
): ReactNode {
  const parts = template.split(/(\{[^}]+\})/g);
  const result = parts.map((part) => {
    const match = part.match(/^\{(\w+)\}$/);
    if (match) {
      const key = match[1];
      return key in params ? params[key] : part;
    }
    return part;
  });
  if (result.every((p) => typeof p === 'string')) {
    return (result as string[]).join('');
  }
  return result;
}

export function createKeyset<const K extends Keyset>(keyset: K) {
  type Keys = keyof K;

  function t(key: Keys, params?: Record<string, string | number>): string {
    const entry = keyset[key as string];
    if (!entry) return String(key);

    if (isPluralTranslation(entry)) {
      const forms = entry[LOCALE];
      const count = (params?.count as number) ?? 0;
      const template = pluralize(count, forms);
      return params ? interpolate(template, params) : template;
    }

    const template = (entry as PlainTranslation)[LOCALE];
    return params ? interpolate(template, params) : template;
  }

  function tRaw(key: Keys, params?: Record<string, ReactNode>): ReactNode {
    const entry = keyset[key as string];
    if (!entry) return String(key);

    if (isPluralTranslation(entry)) {
      const forms = entry[LOCALE];
      const countParam = params?.count;
      const count = typeof countParam === 'number' ? countParam : 0;
      const template = pluralize(count, forms);
      return params ? interpolateRaw(template, params) : template;
    }

    const template = (entry as PlainTranslation)[LOCALE];
    return params ? interpolateRaw(template, params) : template;
  }

  return { t, tRaw };
}
