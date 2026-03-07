import React from 'react';

import { IndexLayout } from './IndexLayout';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof IndexLayout> = {
  title: 'WWW/Layout/IndexLayout',
  component: IndexLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof IndexLayout>;

/**
 * The base "Zero-UI" layout showing how it can be used for custom full-screen content.
 */
export const Default: Story = {
  args: {
    children: (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center gap-8">
        <h1 className="text-4xl font-bold">Custom Index View</h1>
        <p className="max-w-md">
          The IndexLayout is a barebones technical shell. It provides no Header or Footer by
          default, and leaves it up to the child to decide how to handle its space.
        </p>
        <div className="w-full h-32 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-400">
          Custom Dashboard Area
        </div>
      </div>
    ),
  },
};

/**
 * IndexLayout used with a manual footer passed to it.
 */
export const WithManualFooter: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Page with custom Footer</h1>
        <p className="mt-4">
          IndexLayout supports an optional footer slot that can be used to manually orchestrate its
          position.
        </p>
      </div>
    ),
    footer: (
      <div className="p-4 bg-slate-100 dark:bg-slate-900 border-t text-center font-bold">
        I am a manual footer passed to IndexLayout.
      </div>
    ),
  },
};
