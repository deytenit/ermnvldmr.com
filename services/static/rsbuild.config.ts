import { defineServiceConfig } from '@ermnvldmr/rsbuild-config/dev';

export default defineServiceConfig({
  source: {
    entry: {
      index: './src/app/index.tsx',
      error: './src/app/error.tsx',
    },
  },
  html: {
    title: 'Static Content',
  },
});
