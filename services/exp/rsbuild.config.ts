import { defineServiceConfig, localDevServer } from '@ermnvldmr/rsbuild-config/dev';

export default defineServiceConfig({
  server: localDevServer({ port: 3002 }),
  source: {
    entry: { anchorer: './src/app/anchorer.tsx', qriosity: './src/app/qriosity.tsx' },
    preEntry: ['./src/static/global.css'],
    define: {
      // The shared UI reads this at module load. Exp has no locale routing.
      'process.env.LOCALE': JSON.stringify('en'),
    },
  },
  html: {
    title: ({ entryName }) =>
      entryName === 'qriosity' ? 'QRiosity · Experiments' : 'Anchorer · Experiments',
    meta: ({ entryName }) => ({
      description:
        entryName === 'qriosity'
          ? 'Generate and download a QR code for a URL.'
          : 'Generate a clickable link from HTML anchor attributes.',
    }),
  },
});
