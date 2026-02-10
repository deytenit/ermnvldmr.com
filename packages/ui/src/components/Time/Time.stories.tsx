import React from 'react';

import { Time } from './Time';
import { VStack } from '../VStack/VStack';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Time> = {
  title: 'components/Time',
  component: Time,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'tertiary', 'error', 'muted', 'inherit'],
    },
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
    },
    type: {
      control: 'select',
      options: ['display', 'headline', 'title', 'body', 'label'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Time>;

export const Default: Story = {
  args: {
    date: new Date(),
  },
};

export const CustomFormatting: Story = {
  render: () => (
    <VStack gap={4}>
      <Time date={new Date()} formatOptions={{ dateStyle: 'full' }} />
      <Time date={new Date()} formatOptions={{ dateStyle: 'long' }} />
      <Time date={new Date()} formatOptions={{ dateStyle: 'medium' }} />
      <Time date={new Date()} formatOptions={{ dateStyle: 'short' }} />
    </VStack>
  ),
};

export const Styled: Story = {
  render: () => (
    <VStack gap={4}>
      <Time bold color="primary" date={new Date()} size="l" type="headline" />
      <Time italic color="muted" date={new Date()} size="s" type="label" />
    </VStack>
  ),
};

export const CustomChildren: Story = {
  args: {
    date: new Date(),
    children: 'Today',
  },
};
