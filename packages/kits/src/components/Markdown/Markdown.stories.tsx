import { Markdown } from './Markdown';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Markdown> = {
  title: 'Kits/Markdown',
  component: Markdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Markdown>;

export const Default: Story = {
  args: {
    children: `# Markdown Title

This is a **markdown paragraph** with a [link](#) and inline \`code\`.

> Blockquote example text.
`,
  },
};
