import { defineSSGServiceConfig, discoverEntries, umamiAnalytics } from '@ermnvldmr/ssg/dev';
import { THEME_INIT_SCRIPT, THEME_INIT_STYLES } from '@ermnvldmr/ui/dev';

const UMAMI_STATIC_WEBSITE_ID = '0831532a-2cec-4955-8f5b-452d8bba96d8';

export default defineSSGServiceConfig({
  analytics: [
    umamiAnalytics({
      serverUrl: 'https://umami.ermnvldmr.com',
      websiteId: UMAMI_STATIC_WEBSITE_ID,
      domains: 'static.ermnvldmr.com',
      doNotTrack: true,
    }),
  ],
  source: {
    entry: discoverEntries(import.meta.dirname, './src/app/**/*.tsx'),
    preEntry: ['./src/static/global.css'],
    // `@ermnvldmr/i18n` (pulled in transitively via the UI barrel) reads
    // `process.env.LOCALE` at module load, so it must be replaced at build time
    // or it throws "process is not defined" in the browser. This service is
    // single-locale, so pin it here.
    define: {
      'process.env.LOCALE': JSON.stringify(process.env.LOCALE ?? 'en'),
    },
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
