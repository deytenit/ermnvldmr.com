import { Time } from './Time';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Time> = {
  title: 'Kits/Time',
  component: Time,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Time>;

export const Default: Story = {
  args: {
    date: new Date('2026-08-09T12:00:00Z'),
    locale: 'en-US',
  },
};
