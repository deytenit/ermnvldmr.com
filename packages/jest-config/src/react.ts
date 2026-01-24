import type { Config } from 'jest';
import { baseJestConfig } from './base.js';

/**
 * Jest configuration for React projects with jsdom environment.
 * 
 * @example
 * ```typescript
 * import { reactJestConfig } from '@ermnvldmr/jest-config/react';
 * 
 * export default reactJestConfig;
 * ```
 */
export const reactJestConfig: Config = {
  ...baseJestConfig,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    ...baseJestConfig.moduleNameMapper,
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    ...baseJestConfig.transform,
    '^.+\\.(js|jsx|ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};
