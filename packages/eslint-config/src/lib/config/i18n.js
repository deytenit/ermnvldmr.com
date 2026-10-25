// @ts-check
import { i18nPlugin } from '../plugins/i18n.js';
import { markdownParser } from '../parsers/markdown.js';

/**
 * i18n typography and validation ESLint configuration.
 */
export const i18nConfig = [
  {
    files: ['**/*.i18n.{ts,tsx,js,jsx,mjs}'],
    plugins: {
      i18n: i18nPlugin,
    },
    rules: {
      'i18n/no-hanging-particles': 'error',
    },
  },
  {
    files: ['**/*.{md,mdx}'],
    languageOptions: {
      parser: markdownParser,
    },
    plugins: {
      i18n: i18nPlugin,
    },
    rules: {
      'no-irregular-whitespace': 'off',
      'i18n/no-hanging-particles': 'error',
    },
  },
];
