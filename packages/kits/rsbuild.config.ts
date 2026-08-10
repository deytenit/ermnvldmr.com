import { definePackageConfig } from '@ermnvldmr/rsbuild-config/dev';

export default definePackageConfig({
  source: {
    entry: {
      index: './src/index.ts',
    },
  },
  output: {
    distPath: {
      root: 'dist',
      js: '',
    },
    filename: {
      js: '[name].js',
    },
    cleanDistPath: true,
  },
  tools: {
    rspack: {
      output: {
        library: {
          type: 'module',
        },
      },
      experiments: {
        outputModule: true,
      },
      externals: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'tailwindcss',
        '@ermnvldmr/i18n',
        '@ermnvldmr/stl',
        '@ermnvldmr/ui',
        'class-variance-authority',
      ],
      externalsType: 'module',
    },
  },
});
