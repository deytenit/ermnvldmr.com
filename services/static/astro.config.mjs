// @ts-check
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://static.ermnvldmr.com',
  output: 'static',
  build: {
    format: 'file',
  },
  srcDir: './src',
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@ermnvldmr/stl': new URL('../../packages/stl/src', import.meta.url).pathname,
        '@ermnvldmr/ui': new URL('../../packages/ui/src', import.meta.url).pathname,
        '#': new URL('./src/', import.meta.url).pathname,
      },
    },
  },
});
