import { baseConfig } from '@ermnvldmr/eslint-config/dev';

export default [
  ...baseConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: { 'jsdoc/require-example': 'off' },
  },
];
