import { ArticleLayout } from './ArticleLayout';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * Metadata for the ArticleLayout component stories.
 */
const meta: Meta<typeof ArticleLayout> = {
  title: 'WWW/Layouts/ArticleLayout',
  component: ArticleLayout,
  tags: ['autodocs'],
  args: {
    title: 'Building a Modern Content System with Astro 5',
    description:
      "A deep dive into building a scalable, file-based content architecture using Astro's new Content Layer API and MDX.",
    createdDate: new Date('2026-01-31'),
    tags: ['engineering', 'astro', 'react'],
  },
};

export default meta;

/**
 *
 */
type Story = StoryObj<typeof ArticleLayout>;

/**
 * Default story showcasing various HTML elements to verify typography.
 */
export const Default: Story = {
  render: (args) => (
    <ArticleLayout {...args}>
      <h2>Introduction</h2>
      <p>
        Astro 5 introduces the Content Layer API, a powerful way to fetch content from any source,
        including local files, remote APIs, and CMSs. In this article, we&apos;ll explore how to set
        up a robust system for articles and projects.
      </p>

      <blockquote>
        &quot;The best way to manage content is to not manage it at all.&quot; — Someone, probably.
      </blockquote>

      <p>
        Let&apos;s look at some code. Our new <code>content.config.ts</code> uses the{' '}
        <code>glob</code> loader to pull in MDX files from outside the <code>src</code> directory:
      </p>

      <pre>
<code>{`// services/www/src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    createdDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { articles };`}</code>
      </pre>

      <h3>Why Astro 5?</h3>
      <p>
        Astro&apos;s zero-JS by default approach is perfect for content-heavy sites. By moving our
        content outside of the <code>src</code> directory, we keep our project clean and organized.
      </p>

      <ul>
        <li>
          <strong>Better performance:</strong> Only what you need is shipped.
        </li>
        <li>
          <strong>Improved developer experience:</strong> Fast HMR and great tooling.
        </li>
        <li>
          <strong>Type safety:</strong> Zod schemas validate your frontmatter.
        </li>
      </ul>

      <h3>Visual Media</h3>
      <p>
        We can also include images and videos. The layout ensures they are responsive and fit the
        grid.
      </p>
      <div className="bg-muted flex aspect-video items-center justify-center rounded-lg border-2 border-dashed">
        <span className="text-muted-foreground">Placeholder for Image/Video</span>
      </div>

      <p>Conclusion: It&apos;s a great time to be a web developer.</p>
    </ArticleLayout>
  ),
};
