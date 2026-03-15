import { describe, it, expect } from 'vitest';
import { localePath, localeHref } from './path.js';

describe('localePath', () => {
  it('prepends LOCALE to absolute path', () =>
    expect(localePath('/articles')).toBe('/en/articles'));
  it('handles root path', () =>
    expect(localePath('/')).toBe('/en/'));
  it('handles nested path', () =>
    expect(localePath('/articles/2026/test')).toBe('/en/articles/2026/test'));
});

describe('localeHref', () => {
  it('replaces locale prefix in URL', () =>
    expect(localeHref('/en/articles', 'ru')).toBe('/ru/articles'));
  it('replaces locale at root', () =>
    expect(localeHref('/en/', 'ru')).toBe('/ru/'));
  it('falls back to path if no prefix found', () =>
    expect(localeHref('/articles', 'ru')).toBe('/ru/articles'));
});
