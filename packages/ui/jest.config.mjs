import { reactJestConfig } from '@ermnvldmr/jest-config/react';

export default {
  ...reactJestConfig,
  moduleNameMapper: {
    ...reactJestConfig.moduleNameMapper,
    '^@ermnvldmr/stl$': '<rootDir>/../stl/src/index.ts',
  },
};
