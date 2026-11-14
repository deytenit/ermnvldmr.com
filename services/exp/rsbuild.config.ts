import { defineServiceConfig, localDevServer } from '@ermnvldmr/rsbuild-config/dev';

export default defineServiceConfig({
  server:
    process.env.EXP_DEV_HTTP === '1'
      ? { host: 'localhost', port: 3002 }
      : localDevServer({ port: 3002 }),
  source: {
    entry: { 'exp/anchorer': './src/app/exp/anchorer.tsx' },
    preEntry: ['./src/static/global.css'],
    define: {
      // The shared UI reads this at module load. Exp has no locale routing.
      'process.env.LOCALE': JSON.stringify('en'),
    },
  },
  html: {
    title: 'Anchorer · Experiments',
    meta: { description: 'Generate a clickable link from HTML anchor attributes.' },
  },
});
