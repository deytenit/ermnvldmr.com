import { createReadStream, existsSync } from 'node:fs';
import { extname, join } from 'node:path';
import { defineSSGServiceConfig, discoverEntries, mergeConfig } from '@ermnvldmr/ssg/dev';
import { THEME_INIT_SCRIPT, THEME_INIT_STYLES } from '@ermnvldmr/ui/dev';
import { localeRsbuildConfig } from '@ermnvldmr/i18n/dev';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { pluginMdx } from '@rsbuild/plugin-mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.txt': 'text/plain',
};

const locale = process.env.LOCALE ?? 'en';
const fontBase = `/${locale}/static/font`;

export default defineSSGServiceConfig(
  mergeConfig(localeRsbuildConfig(), {
    dev: {
      // Serve public/static/* at /static/* directly, bypassing server.base.
      // Without this, server.base (e.g. /en) would push the public dir to
      // /en/static/*, making /static/* unreachable in dev.
      setupMiddlewares: [
        (middlewares) => {
          middlewares.unshift((req, res, next) => {
            const url = (req as { url?: string }).url ?? '';
            if (!url.startsWith('/static/')) return next();

            const filePath = join(import.meta.dirname, 'public', url.split('?')[0] ?? url);
            if (!existsSync(filePath)) return next();

            const mime = MIME[extname(filePath)] ?? 'application/octet-stream';
            res.setHeader('Content-Type', mime);
            createReadStream(filePath).pipe(res as import('node:stream').Writable);
          });
          return middlewares;
        },
      ],
    },
    tools: {
      rspack: {
        plugins: [
          process.env.RSDOCTOR === 'true' &&
            new RsdoctorRspackPlugin({
              disableClientServer: true,
              output: { reportDir: './rsdoctor', mode: 'brief' },
            }),
        ].filter(Boolean),
      },
    },
    plugins: [
      pluginMdx({
        mdxLoaderOptions: {
          remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: 'frontmatter' }]],
        },
      }),
    ],
    source: {
      entry: discoverEntries(import.meta.dirname, './src/app/**/*.tsx'),
      preEntry: ['./src/static/global.css'],
    },
    html: {
      tags: [
        { tag: 'script', children: THEME_INIT_SCRIPT, head: true },
        { tag: 'style', children: THEME_INIT_STYLES, head: true },
        {
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href: `${fontBase}/lato-400.woff2`,
            crossorigin: true,
          },
          publicPath: false,
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href: `${fontBase}/lato-700.woff2`,
            crossorigin: true,
          },
          publicPath: false,
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href: `${fontBase}/eb-garamond-var.woff2`,
            crossorigin: true,
          },
          publicPath: false,
        },
      ],
    },
  })
);
