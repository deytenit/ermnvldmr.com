// @ts-check
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.ermnvldmr.com',
  output: 'static',
  srcDir: './src',
  integrations: [mdx(), sitemap(), react()],

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
