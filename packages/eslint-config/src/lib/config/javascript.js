// @ts-check
import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';

/**
 * Core JavaScript and Prettier configuration.
 */
export const javascriptConfig = [
  // JavaScript recommended rules
  eslint.configs.recommended,

  // Browser and Service Worker globals
  {
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },

  // Prettier integration (must be last in the assembler)
  prettier,
];
