import {
  Header,
  Paragraph,
  List,
  Blockquote,
  Code,
  CodeBlock,
  Container,
  Text,
} from '@ermnvldmr/ui';
import React from 'react';

import { ArticleLayout } from './ArticleLayout';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * Metadata for the ArticleLayout component stories.
 */
const meta: Meta<typeof ArticleLayout> = {
  title: 'WWW/Layout/ArticleLayout',
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
 * Default story showcasing various UI components to verify typography in layout.
 */
export const Default: Story = {
  render: (args) => (
    <ArticleLayout {...args}>
      <Header level={2}>Introduction</Header>
      <Paragraph>
        Astro 5 introduces the Content Layer API, a powerful way to fetch content from any source,
        including local files, remote APIs, and CMSs. In this article, we&apos;ll explore how to set
        up a robust system for articles and projects.
      </Paragraph>

      <Blockquote>
        The best way to manage content is to not manage it at all.
        <Blockquote.Citation>Someone, probably</Blockquote.Citation>
      </Blockquote>

      <Paragraph>
        Let&apos;s look at some code. Our new <Code>content.config.ts</Code> uses the{' '}
        <Code>glob</Code> loader to pull in MDX files from outside the <Code>src</Code> directory:
      </Paragraph>

      <CodeBlock label="content.config.ts">
        <Code>
          {`// services/www/src/content.config.ts
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

export const collections = { articles };`}
        </Code>
      </CodeBlock>

      <Header level={3}>Why Astro 5?</Header>
      <Paragraph>
        Astro&apos;s zero-JS by default approach is perfect for content-heavy sites. By moving our
        content outside of the <Code>src</Code> directory, we keep our project clean and organized.
      </Paragraph>

      <List spacing="s" variant="unordered">
        <List.Item>
          <Text bold>Better performance:</Text> Only what you need is shipped.
        </List.Item>
        <List.Item>
          <Text bold>Improved developer experience:</Text> Fast HMR and great tooling.
        </List.Item>
        <List.Item>
          <Text bold>Type safety:</Text> Zod schemas validate your frontmatter.
        </List.Item>
      </List>

      <Header level={3}>Visual Media</Header>
      <Paragraph>
        We can also include images and videos. The layout ensures they are responsive and fit the
        grid.
      </Paragraph>
      <Container
        border
        bg="muted"
        className="flex aspect-video items-center justify-center"
        rounded="lg"
      >
        <Text color="muted">Placeholder for Image/Video</Text>
      </Container>

      <Paragraph>Conclusion: It&apos;s a great time to be a web developer.</Paragraph>
    </ArticleLayout>
  ),
};
