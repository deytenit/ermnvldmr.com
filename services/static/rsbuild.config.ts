import { defineServiceConfig, discoverEntries } from '@ermnvldmr/rsbuild-config/dev';
import { THEME_INIT_SCRIPT, THEME_INIT_STYLES } from '@ermnvldmr/ui/dev';

export default defineServiceConfig({
  source: {
    entry: discoverEntries(import.meta.dirname, './src/app/**/*.tsx'),
  },
  html: {
    title: 'Static Content',
    tags: [
      {
        tag: 'script',
        children: THEME_INIT_SCRIPT,
        head: true,
      },
      {
        tag: 'style',
        children: THEME_INIT_STYLES,
        head: true,
      },
    ],
  },
});
