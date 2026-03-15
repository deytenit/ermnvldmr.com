import { describe, it, expect } from 'vitest';

import { pluralize } from './pluralize.js';

const forms = { none: 'none', one: 'one', some: 'some', many: 'many' };

describe('pluralize', () => {
  it('returns none for 0', () => expect(pluralize(0, forms)).toBe('none'));
  it('returns one for 1', () => expect(pluralize(1, forms)).toBe('one'));
  it('returns some for 2', () => expect(pluralize(2, forms)).toBe('some'));
  it('returns some for 4', () => expect(pluralize(4, forms)).toBe('some'));
  it('returns many for 5', () => expect(pluralize(5, forms)).toBe('many'));
  it('returns many for 11', () => expect(pluralize(11, forms)).toBe('many'));
  it('returns many for 12', () => expect(pluralize(12, forms)).toBe('many'));
  it('returns many for 100', () => expect(pluralize(100, forms)).toBe('many'));
  it('returns one for 21', () => expect(pluralize(21, forms)).toBe('one'));
  it('returns some for 22', () => expect(pluralize(22, forms)).toBe('some'));
  it('returns many for 111', () => expect(pluralize(111, forms)).toBe('many'));
});
