import { defineServiceConfig, discoverEntries, mergeConfig } from '@ermnvldmr/rsbuild-config/dev';
import { THEME_INIT_SCRIPT, THEME_INIT_STYLES } from '@ermnvldmr/ui/dev';
import { localeRsbuildConfig } from '@ermnvldmr/i18n/dev';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { pluginMdx } from '@rsbuild/plugin-mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

const fontBase = 'static/font';

export default defineServiceConfig(
  mergeConfig(localeRsbuildConfig(), {
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
        },
      ],
    },
  })
);
