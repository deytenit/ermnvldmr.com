import { defineServiceConfig, discoverEntries } from '@ermnvldmr/rsbuild-config/dev';
import { pluginMdx } from '@rsbuild/plugin-mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

export default defineServiceConfig({
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
});
