import { Welcome } from './Welcome';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Welcome> = {
  title: 'Widgets/Welcome',
  component: Welcome,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Welcome>;

export const Default: Story = {};
