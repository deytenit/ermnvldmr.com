import { defineServiceConfig } from '@ermnvldmr/rsbuild-config';
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
    entry: {
      index: './src/app/index.tsx',
      'articles/index': './src/app/articles/index.tsx',
      'articles/2026/test-article': './src/app/articles/2026/test-article.tsx',
    },
  },
});
