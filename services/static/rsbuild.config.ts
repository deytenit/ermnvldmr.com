import { defineSSGServiceConfig, discoverEntries } from '@ermnvldmr/ssg/dev';
import { THEME_INIT_SCRIPT, THEME_INIT_STYLES } from '@ermnvldmr/ui/dev';

export default defineSSGServiceConfig({
  source: {
    entry: discoverEntries(import.meta.dirname, './src/app/**/*.tsx'),
    preEntry: ['./src/static/global.css'],
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
