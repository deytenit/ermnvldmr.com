/** The four plural categories used across EN and RU grammar rules. */
export interface PluralForms {
  none: string;
  one: string;
  some: string;
  many: string;
}

/**
 * Selects the correct plural form for the given count.
 * Covers both English (none/one/many) and Russian (none/one/some/many) rules.
 *
 * @param count - The numeric value to pluralise.
 * @param forms - The set of plural forms to select from.
 * @returns The appropriate plural form string.
 * @example
 * const forms = { none: 'no items', one: 'one item', some: '{n} items', many: '{n} items' };
 * pluralize(0, forms)  // → 'no items'
 * pluralize(1, forms)  // → 'one item'
 * pluralize(3, forms)  // → '{n} items'  (some)
 * pluralize(21, forms) // → 'one item'   (Russian rule: 21 ends in 1)
 */
export function pluralize(count: number, forms: PluralForms): string {
  if (count === 0) return forms.none;
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms.one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms.some;
  return forms.many;
}
