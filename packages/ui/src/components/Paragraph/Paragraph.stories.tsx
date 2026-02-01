import React from 'react';

import { Paragraph } from './Paragraph';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Paragraph> = {
  title: 'components/Paragraph',
  component: Paragraph,
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'select', options: ['left', 'center', 'right', 'justify'] },
    wrap: { control: 'select', options: ['nowrap', 'balance', 'pretty'] },
    gutterBottom: { control: 'boolean' },
    indent: { control: 'boolean' },
    dropCap: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['display', 'headline', 'title', 'body', 'label'],
    },
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'tertiary', 'error', 'muted', 'inherit'],
    },
  },
};

export default meta;

/**
 * Story helper type for Paragraph.
 */
type Story = StoryObj<typeof Paragraph>;

/**
 * The default Paragraph story showing standard body text.
 */
export const Default: Story = {
  args: {
    children:
      'This is a standard paragraph used for body text. It wraps naturally and provides good readability defaults using the body type and medium size from the design system.',
  },
};

export const Editorial: Story = {
  args: {
    dropCap: true,
    indent: true,
    align: 'justify',
    className: 'max-w-md',
    children:
      'Once upon a time, there was a design system that needed a robust paragraph component. It was designed to handle long-form content with grace, supporting traditional typesetting features like drop caps and first-line indentation. This helps create a more engaging reading experience for long-form articles or documentation.',
  },
};

export const VerticalRhythm: Story = {
  render: () => (
    <div className="max-w-md border p-4">
      <Paragraph gutterBottom>
        This is the first paragraph with <code>gutterBottom</code> enabled. It adds a margin at the
        bottom to separate it from the next block of text, establishing a clear vertical rhythm.
      </Paragraph>
      <Paragraph gutterBottom>
        The second paragraph also has <code>gutterBottom</code>. Notice the consistent spacing
        between these blocks.
      </Paragraph>
      <Paragraph>
        This final paragraph does not have <code>gutterBottom</code>, so any subsequent elements
        would be placed immediately after it without the extra spacing.
      </Paragraph>
    </div>
  ),
};
