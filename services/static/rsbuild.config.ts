import { defineServiceConfig, discoverEntries } from '@ermnvldmr/rsbuild-config/dev';

export default defineServiceConfig({
  source: {
    entry: discoverEntries(import.meta.dirname, './src/app/**/*.tsx'),
  },
  html: {
    title: 'Static Content',
  },
});
