import { baseVitestConfig } from '@ermnvldmr/rsbuild-config/dev';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(baseVitestConfig, {
  test: {
    environment: 'node',
  },
});
