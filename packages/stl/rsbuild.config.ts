import { definePackageConfig } from '@ermnvldmr/rsbuild-config';

export default definePackageConfig({
  source: {
    entry: {
      index: './src/index.ts',
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
      js: 'index.js',
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
