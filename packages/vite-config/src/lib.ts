import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import type { UserConfig } from 'vite';

/**
 * Base Vite configuration for library packages.
 * 
 * @param packageName - The name for the library build
 * @param entry - Entry point file path (relative to package root)
 * @param external - Array of external dependencies to exclude from bundle
 * @returns Vite configuration object
 * 
 * @example
 * ```typescript
 * import { createLibConfig } from '@ermnvldmr/vite-config/lib';
 * 
 * export default createLibConfig('MyLib', 'src/index.ts', ['react', 'react-dom']);
 * ```
 */
export function createLibConfig(
  packageName: string,
  entry: string = 'src/index.ts',
  external: string[] = []
): UserConfig {
  return defineConfig({
    plugins: [
      dts({
        insertTypesEntry: true,
      }),
    ],
    build: {
      lib: {
        entry: resolve(process.cwd(), entry),
        name: packageName,
        formats: ['es'],
        fileName: 'index',
      },
      rollupOptions: {
        external: [
          'react',
          'react-dom', 
          'react/jsx-runtime', 
          'react/jsx-dev-runtime',
          'tailwindcss',
          ...external
        ],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'React',
            'react/jsx-dev-runtime': 'React',
          },
        },
      },
      cssCodeSplit: false,
    },
    resolve: {
      alias: {
        '@': resolve(process.cwd(), 'src'),
      },
    },
  });
}
