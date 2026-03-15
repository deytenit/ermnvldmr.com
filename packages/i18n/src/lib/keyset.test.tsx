import React from 'react';
import { describe, it, expect } from 'vitest';

import { createKeyset } from './keyset.js';

const { t, tRaw } = createKeyset({
  greeting: { en: 'Hello', ru: 'Привет' },
  'count {value}': { en: 'count {value}', ru: 'счёт {value}' },
  items: {
    en: { none: 'no items', one: 'one item', some: '{count} items', many: '{count} items' },
    ru: { none: 'нет элементов', one: 'один элемент', some: '{count} элемента', many: '{count} элементов' },
  },
});

describe('t', () => {
  it('returns plain translation', () => expect(t('greeting')).toBe('Hello'));
  it('interpolates {value}', () => expect(t('count {value}', { value: '42' })).toBe('count 42'));
  it('pluralizes none', () => expect(t('items', { count: 0 })).toBe('no items'));
  it('pluralizes one', () => expect(t('items', { count: 1 })).toBe('one item'));
  it('pluralizes many with interpolation', () =>
    expect(t('items', { count: 5 })).toBe('5 items'));
});

describe('tRaw', () => {
  it('returns string node for plain key', () => expect(tRaw('greeting')).toBe('Hello'));
  it('interpolates ReactNode', () => {
    const node = tRaw('count {value}', { value: React.createElement('strong', null, '42') });
    expect(Array.isArray(node)).toBe(true);
  });
});
