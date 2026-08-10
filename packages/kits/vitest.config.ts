import { reactVitestConfig } from '@ermnvldmr/rsbuild-config/dev';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(reactVitestConfig, {
  test: {
    // Package specific overrides
  },
});
