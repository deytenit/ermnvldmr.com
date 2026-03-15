import { defineServiceConfig, discoverEntries } from '@ermnvldmr/rsbuild-config/dev';
import { THEME_INIT_SCRIPT, THEME_INIT_STYLES } from '@ermnvldmr/ui/dev';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { pluginMdx } from '@rsbuild/plugin-mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

export default defineServiceConfig({
  tools: {
    rspack: {
      plugins: [
        process.env.RSDOCTOR === 'true' &&
          new RsdoctorRspackPlugin({
            disableClientServer: true,
            output: {
              reportDir: './rsdoctor',
            },
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
