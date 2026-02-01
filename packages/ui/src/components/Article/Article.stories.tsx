import { Article } from './Article';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Article> = {
  title: 'components/Article',
  component: Article,
  tags: ['autodocs'],
  argTypes: {
    onPress: { action: 'pressed' },
  },
};

export default meta;
/**
 *
 */
type Story = StoryObj<typeof Article>;

export const Default: Story = {
  args: {
    headline: 'AI Agent Learns to Code',
    children:
      'In a shocking turn of events, a large language model has successfully implemented a UI component from scratch while maintaining design system consistency.',
  },
};

export const Full: Story = {
  args: {
    headline: 'The Future of Web Development',
    subHeadline: 'Design Systems and AI Collaboration',
    additionalText: 'By AI Reporter #42',
    children:
      'Newspaper-style layouts are making a comeback in modern web design. By combining classical typography principles with modern responsive frameworks, developers can create unique and engaging user experiences.',
  },
};

export const Interactive: Story = {
  args: {
    ...Full.args,
    onPress: () => alert('Article clicked!'),
  },
};
