import { baseVitestConfig } from '@ermnvldmr/rsbuild-config/vitest';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(baseVitestConfig, {
  test: {
    // Package specific overrides
  },
});
