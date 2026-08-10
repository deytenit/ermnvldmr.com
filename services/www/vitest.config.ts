import { reactVitestConfig } from '@ermnvldmr/rsbuild-config/dev';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(reactVitestConfig, {
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./.config/vitest/setup.ts'],
  },
});
