import type { Meta, StoryObj } from '@storybook/react';
import { Welcome } from './Welcome';

const meta: Meta<typeof Welcome> = {
  title: 'WWW/Widgets/Welcome',
  component: Welcome,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Welcome>;

export const Default: Story = {};
