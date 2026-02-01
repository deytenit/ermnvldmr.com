import React from 'react';

import { Header } from './Header';
import { VStack } from '../VStack/VStack';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Header> = {
  title: 'components/Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6],
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'tertiary', 'error', 'muted', 'inherit'],
    },
  },
};

export default meta;
/**
 *
 */
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    children: 'Header Level 1',
    level: 1,
  },
};

export const AllLevels: Story = {
  render: () => (
    <VStack gap={4}>
      <Header level={1}>Header Level 1 (Display L)</Header>
      <Header level={2}>Header Level 2 (Display M)</Header>
      <Header level={3}>Header Level 3 (Headline L)</Header>
      <Header level={4}>Header Level 4 (Headline M)</Header>
      <Header level={5}>Header Level 5 (Title L)</Header>
      <Header level={6}>Header Level 6 (Title M)</Header>
    </VStack>
  ),
};

export const Overrides: Story = {
  render: () => (
    <VStack gap={4}>
      <Header level={1} size="s" type="headline">
        H1 Tag with Headline Small Style
      </Header>
      <Header color="primary" level={3} size="l" type="body">
        H3 Tag with Body Large Style and Primary Color
      </Header>
      <Header italic underline level={6}>
        H6 with Modifiers
      </Header>
    </VStack>
  ),
};
