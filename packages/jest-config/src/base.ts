import type { Config } from 'jest';

/**
 * Base Jest configuration for TypeScript projects.
 * 
 * @example
 * ```typescript
 * import { baseJestConfig } from '@ermnvldmr/jest-config/base';
 * 
 * export default {
 *   ...baseJestConfig,
 *   // package-specific overrides
 * } satisfies Config;
 * ```
 */
export const baseJestConfig: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '**/__tests__/**/*.{ts,tsx}',
    '**/*.{test,spec}.{ts,tsx}',
  ],
};
