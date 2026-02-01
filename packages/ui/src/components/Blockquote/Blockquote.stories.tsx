import React from 'react';

import { Blockquote } from './Blockquote';
import { Paragraph } from '../Paragraph/Paragraph';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Blockquote> = {
  title: 'Components/Blockquote',
  component: Blockquote,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Blockquote>;

export const Default: Story = {
  render: (args) => (
    <Blockquote {...args}>
      <Paragraph>
        Design is not just what it looks like and feels like. Design is how it works.
      </Paragraph>
      <Blockquote.Citation>Steve Jobs</Blockquote.Citation>
    </Blockquote>
  ),
};

export const Inset: Story = {
  args: {
    variant: 'inset',
  },
  render: (args) => (
    <Blockquote {...args}>
      <Paragraph italic>The only way to do great work is to love what you do.</Paragraph>
      <Blockquote.Citation>Steve Jobs</Blockquote.Citation>
    </Blockquote>
  ),
};
