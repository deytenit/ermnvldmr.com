import { ThemeSwitch } from './ThemeSwitch';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ThemeSwitch> = {
  title: 'Components/ThemeSwitch',
  component: ThemeSwitch,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ThemeSwitch>;

export const Default: Story = {};
