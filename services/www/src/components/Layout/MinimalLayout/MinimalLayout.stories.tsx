import { Header, Paragraph, VStack } from '@ermnvldmr/ui';
import React from 'react';

import { MinimalLayout } from './MinimalLayout';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof MinimalLayout> = {
  title: 'WWW/Layout/MinimalLayout',
  component: MinimalLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MinimalLayout>;

/**
 * Minimal layout for focused pages. No header, just content and footer.
 */
export const Default: Story = {
  args: {
    children: (
      <VStack className="p-12" gap={6}>
        <Header level={1}>Minimal Layout</Header>
        <Paragraph size="l">
          MinimalLayout is for focused experiences where you want to minimize distractions. It
          includes only the main content area and the common site footer at the bottom.
        </Paragraph>
        <Paragraph>You&apos;ll notice there is no site header/navigation in this view.</Paragraph>
      </VStack>
    ),
  },
};

/**
 * Minimal layout with a centered landing section.
 */
export const LandingStyle: Story = {
  args: {
    children: (
      <VStack align="center" className="text-center px-4" gap={8}>
        <div className="w-24 h-24 bg-slate-900 dark:bg-slate-100 rounded-full flex items-center justify-center text-white dark:text-black text-3xl font-bold">
          VE
        </div>
        <VStack gap={4}>
          <Header level={1}>Vladimir Eremin</Header>
          <Paragraph size="l">Building software with focus and precision.</Paragraph>
        </VStack>
      </VStack>
    ),
    centerVertically: true,
  },
};
