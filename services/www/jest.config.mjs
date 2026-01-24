import { reactJestConfig } from '@ermnvldmr/jest-config/react';

export default {
  ...reactJestConfig,
  moduleNameMapper: {
    ...reactJestConfig.moduleNameMapper,
    '^#(.*)$': '<rootDir>/src/$1',
    '^@ermnvldmr/ui/(.*)$': '<rootDir>/../../packages/ui/src/$1',
    '^@ermnvldmr/ui$': '<rootDir>/../../packages/ui/src',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.astro',
  ],
};
