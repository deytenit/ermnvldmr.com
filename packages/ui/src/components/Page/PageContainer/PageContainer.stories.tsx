import React from 'react';

import { PageContainer } from './PageContainer';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PageContainer> = {
  title: 'components/Page/PageContainer',
  component: PageContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'select',
      options: ['slim', 'default', 'wide', 'full'],
    },
    paddingX: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
    },
    paddingY: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
    },
    centerVertically: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageContainer>;

const Box = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`p-4 bg-slate-200 dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-600 rounded-lg ${className}`}
  >
    {children}
  </div>
);

/**
 * Standard container with default width and padding.
 */
export const Default: Story = {
  args: {
    children: <Box>Default Container Content</Box>,
    width: 'default',
    paddingY: 'medium',
  },
};

/**
 * Narrower slim container, ideal for articles.
 */
export const Slim: Story = {
  args: {
    children: <Box>Slim Container Content (1100px Max-Width)</Box>,
    width: 'slim',
    paddingY: 'medium',
  },
};

/**
 * Wider wide container, useful for dashboards.
 */
export const Wide: Story = {
  args: {
    children: <Box>Wide Container Content (1920px Max-Width)</Box>,
    width: 'wide',
    paddingY: 'medium',
  },
};

/**
 * Vertically centered container.
 */
export const VerticallyCentered: Story = {
  render: (args) => (
    <div className="h-[400px] border-2 border-dashed border-slate-300 dark:border-slate-700 m-4 flex flex-col">
      <PageContainer {...args} centerVertically className="flex-1">
        <Box className="text-center font-bold">I am vertically centered!</Box>
      </PageContainer>
    </div>
  ),
};

/**
 * Demonstration of different horizontal padding scales.
 */
export const PaddingScales: Story = {
  render: () => (
    <div className="flex flex-col gap-8 py-8">
      <div>
        <h3 className="mb-2 font-bold px-4">paddingX: small</h3>
        <PageContainer paddingX="small" width="full">
          <Box className="bg-blue-100 dark:bg-blue-900 border-blue-300">Small Padding Content</Box>
        </PageContainer>
      </div>
      <div>
        <h3 className="mb-2 font-bold px-4">paddingX: medium (Default)</h3>
        <PageContainer paddingX="medium" width="full">
          <Box className="bg-green-100 dark:bg-green-900 border-green-300">
            Medium Padding Content
          </Box>
        </PageContainer>
      </div>
      <div>
        <h3 className="mb-2 font-bold px-4">paddingX: large</h3>
        <PageContainer paddingX="large" width="full">
          <Box className="bg-purple-100 dark:bg-purple-900 border-purple-300">
            Large Padding Content
          </Box>
        </PageContainer>
      </div>
    </div>
  ),
};
