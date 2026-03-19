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
    title: 'Building a Modern Content System with Rsbuild',
    description:
      "A deep dive into building a scalable, file-based content architecture using Rsbuild's MDX support and Rspack.",
    createdDate: new Date('2026-03-19'),
    tags: ['engineering', 'rsbuild', 'react'],
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
        Rsbuild provides a modern, high-performance build toolchain based on Rspack.
        In this article, we&apos;ll explore how to set up a robust system for articles
        and projects using MDX and React.
      </Paragraph>

      <Blockquote>
        The best way to manage content is to not manage it at all.
        <Blockquote.Citation>Someone, probably</Blockquote.Citation>
      </Blockquote>

      <Paragraph>
        Let&apos;s look at some code. Our <Code>rsbuild.config.ts</Code> uses the{' '}
        <Code>pluginMdx</Code> to handle MDX files:
      </Paragraph>

      <CodeBlock label="rsbuild.config.ts">
        <Code>
          {`import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginMdx } from '@rsbuild/plugin-mdx';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginMdx({
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    }),
  ],
});`}
        </Code>
      </CodeBlock>

      <Header level={3}>Why Rsbuild?</Header>
      <Paragraph>
        Rsbuild&apos;s performance is unparalleled thanks to Rspack. By using a Rust-based
        bundler, we keep our development loop fast and our builds efficient.
      </Paragraph>

      <List spacing="s" variant="unordered">
        <List.Item>
          <Text bold>Better performance:</Text> Rust-powered builds and HMR.
        </List.Item>
        <List.Item>
          <Text bold>Improved developer experience:</Text> Sensible defaults and great tooling.
        </List.Item>
        <List.Item>
          <Text bold>Type safety:</Text> Full TypeScript support out of the box.
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
