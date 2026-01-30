import { Welcome } from './Welcome';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * Metadata for the Welcome component stories.
 */
const meta: Meta<typeof Welcome> = {
  title: 'WWW/Widgets/Welcome',
  component: Welcome,
  tags: ['autodocs'],
};

export default meta;

/**
 * Story type for the Welcome component.
 */
type Story = StoryObj<typeof Welcome>;

/**
 * Default story for the Welcome component.
 */
export const Default: Story = {};
