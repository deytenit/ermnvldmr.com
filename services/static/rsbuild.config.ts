import { defineServiceConfig } from '@ermnvldmr/rsbuild-config';

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
