import { definePackageConfig } from '@ermnvldmr/rsbuild-config/dev';

export default definePackageConfig({
  source: {
    entry: {
      index: './src/index.ts',
      testing: './src/testing.ts',
      dev: './src/dev.ts',
    },
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  output: {
    distPath: {
      root: 'dist',
      js: '',
      css: 'styles',
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
        '@ermnvldmr/stl',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-navigation-menu',
        '@radix-ui/react-slot',
        'class-variance-authority',
        'lucide-react',
        'react-aria',
        'react-icons',
        'tw-animate-css',
      ],
      externalsType: 'module',
    },
  },
});
