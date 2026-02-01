import React from 'react';

import { Image } from './Image';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Image> = {
  title: 'components/Image',
  component: Image,
  tags: ['autodocs'],
  argTypes: {
    rounded: {
      control: 'radio',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    shadow: {
      control: 'radio',
      options: ['none', 'sm', 'md', 'lg'],
    },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Image>;

export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop',
    alt: 'Beautiful Landscape',
    width: '100%',
    ratio: '16/9',
    rounded: 'lg',
    shadow: 'md',
  },
};

export const AspectRatios: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">16:9 (Landscape)</span>
        <Image
          alt="16:9"
          ratio="16/9"
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
          width="100%"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">1:1 (Square)</span>
        <Image
          alt="1:1"
          ratio="1/1"
          rounded="full"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2000&auto=format&fit=crop"
          width="100%"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">4:5 (Portrait)</span>
        <Image
          alt="4:5"
          ratio="4/5"
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
          width="100%"
        />
      </div>
    </div>
  ),
};

export const ObjectFit: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Cover (Default)</span>
        <Image
          alt="Cover"
          height="200px"
          objectFit="cover"
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2074&auto=format&fit=crop"
          width="100%"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Contain</span>
        <Image
          alt="Contain"
          className="bg-neutral-100 dark:bg-neutral-800"
          height="200px"
          objectFit="contain"
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2074&auto=format&fit=crop"
          width="100%"
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Fill</span>
        <Image
          alt="Fill"
          height="200px"
          objectFit="fill"
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2074&auto=format&fit=crop"
          width="100%"
        />
      </div>
    </div>
  ),
};

export const LoadingState: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Simulated Loading (Using Stub)</span>
      <Image alt="Loading" ratio="16/9" src="https://invalid-url.jpg" width="300px" />
            <p className="text-xs text-neutral-500">Note: This will stay in &quot;loading&quot; then &quot;error&quot; state because URL is invalid.</p>
      
    </div>
  ),
};
