import { localDevServer } from '@ermnvldmr/rsbuild-config/dev';
import { defineSSGServiceConfig, discoverEntries, umamiAnalytics } from '@ermnvldmr/ssg/dev';
import { THEME_INIT_SCRIPT, THEME_INIT_STYLES } from '@ermnvldmr/ui/dev';

const UMAMI_STATIC_WEBSITE_ID = 'de274e99-9e1e-41bb-981a-9a4fd21d39c5';

export default defineSSGServiceConfig({
  server: localDevServer({ port: 3001 }),
  analytics: [
    umamiAnalytics({
      serverUrl: 'https://umami.ermnvldmr.com',
      scriptName: 'trace.js',
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
