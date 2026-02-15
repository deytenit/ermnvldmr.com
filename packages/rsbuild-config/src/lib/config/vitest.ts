import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Base Vitest configuration for the monorepo.
 */
export const baseVitestConfig = defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['node_modules/**', 'dist/**', '**/*.d.ts', '**/*.config.*', '**/*.stories.tsx'],
    },
  },
});

/**
 * React-specific Vitest configuration.
 */
export const reactVitestConfig = defineConfig({
  test: {
    ...baseVitestConfig.test,
    environment: 'jsdom',
    setupFiles: ['./.config/vitest/setup.ts'],
    alias: {
      // Handle asset mocks if needed
      '\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
  },
  plugins: [tsconfigPaths()],
});
