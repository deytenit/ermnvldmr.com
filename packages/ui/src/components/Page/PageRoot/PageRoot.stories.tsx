import React from 'react';

import { PageRoot } from './PageRoot';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PageRoot> = {
  title: 'components/Page/PageRoot',
  component: PageRoot,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageRoot>;

/**
 * The default PageRoot story showing the base technical container.
 */
export const Default: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Page Root Content</h1>
        <p className="mt-4">
          This is the base technical container that handles theme initialization and core
          background/text colors.
        </p>
      </div>
    ),
  },
};

/**
 * PageRoot with custom background classes.
 */
export const CustomStyling: Story = {
  args: {
    className: 'bg-slate-100 dark:bg-slate-900',
    children: (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Custom Styled Root</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          PageRoot accepts a className prop to override or extend base styles.
        </p>
      </div>
    ),
  },
};
