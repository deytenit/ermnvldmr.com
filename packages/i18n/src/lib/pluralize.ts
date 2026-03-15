export interface PluralForms {
  none: string;
  one: string;
  some: string;
  many: string;
}

/**
 * Selects the correct plural form for the given count.
 * Covers both English (none/one/many) and Russian (none/one/some/many) rules.
 */
export function pluralize(count: number, forms: PluralForms): string {
  if (count === 0) return forms.none;
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms.one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms.some;
  return forms.many;
}
