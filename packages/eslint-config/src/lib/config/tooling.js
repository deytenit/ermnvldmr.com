// @ts-check
import tseslint from 'typescript-eslint';

/**
 * Rules for tooling, config files, and CommonJS files.
 */
export const toolingConfig = [
  // CommonJS files - disable all TypeScript rules
  {
    files: ['**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
  },

  // Config files and tooling
  {
    files: ['*.config.{js,ts,mjs,cjs}', '.storybook/**/*.{js,ts,cjs,mjs}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      'jsdoc/require-jsdoc': 'off',
      'no-undef': 'off', // For CommonJS files
    },
  },
];
