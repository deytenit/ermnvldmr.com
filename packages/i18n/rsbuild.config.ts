import { definePackageConfig } from '@ermnvldmr/rsbuild-config/dev';

export default definePackageConfig({
  source: {
    entry: {
      index: './src/index.ts',
      dev: './src/dev.ts',
      testing: './src/testing.ts',
    },
    alias: { '@': './src' },
  },
  output: {
    target: 'web',
    distPath: { root: 'dist', js: '' },
    filename: { js: '[name].js' },
    cleanDistPath: true,
  },
  tools: {
    htmlPlugin: false,
    rspack: {
      output: { library: { type: 'module' } },
      experiments: { outputModule: true },
      externals: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
      externalsType: 'module',
    },
  },
});
