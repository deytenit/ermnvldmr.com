import React from 'react';

import { Stub } from './Stub';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Stub> = {
  title: 'components/Stub',
  component: Stub,
  tags: ['autodocs'],
  argTypes: {
    rounded: {
      control: 'radio',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    animate: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Stub>;

export const Default: Story = {
  args: {
    width: '200px',
    height: '100px',
    rounded: 'md',
    animate: true,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Text Skeletons</span>
        <Stub height="1rem" width="60%" />
        <Stub height="1rem" width="80%" />
        <Stub height="1rem" width="40%" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Avatar Skeleton</span>
        <Stub height="3rem" rounded="full" width="3rem" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Card Skeleton</span>
        <Stub height="200px" rounded="lg" width="100%" />
      </div>
    </div>
  ),
};

export const Static: Story = {
  args: {
    width: '200px',
    height: '100px',
    animate: false,
  },
};
