import { definePackageConfig } from '@ermnvldmr/rsbuild-config/dev';

export default definePackageConfig({
  source: {
    entry: {
      index: './src/index.ts',
      testing: './src/testing.ts',
      dev: './src/dev.ts',
    },
    alias: {
      '@': './src',
    },
  },
  output: {
    target: 'web',
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
    htmlPlugin: false,
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
        'clsx',
        'tailwind-merge',
      ],
      externalsType: 'module',
    },
  },
});
