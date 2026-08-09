import React from 'react';

import { ThemeSwitch } from './ThemeSwitch';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ThemeSwitch> = {
  title: 'Kits/ThemeSwitch',
  component: ThemeSwitch,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ThemeSwitch>;

export const Default: Story = {
  render: () => <ThemeSwitch aria-label="Toggle Theme" />,
};
