import React from 'react';

import { PageColumns } from './PageColumns';
import { PageColumn } from '../PageColumn/PageColumn';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PageColumns> = {
  title: 'components/Page/PageColumns',
  component: PageColumns,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageColumns>;

const Box = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`p-6 bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl h-full flex items-center justify-center font-bold text-center ${className}`}
  >
    {children}
  </div>
);

/**
 * A standard two-column layout: small sidebar and full main area.
 */
export const TwoColumnsSidebarLeft: Story = {
  args: {
    gap: 8,
    children: (
      <>
        <PageColumn size="small">
          <Box className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            Small Sidebar
          </Box>
        </PageColumn>
        <PageColumn size="full">
          <Box className="min-h-[200px]">Main Full Content</Box>
        </PageColumn>
      </>
    ),
  },
};

/**
 * A standard two-column layout with sidebar on the right.
 */
export const TwoColumnsSidebarRight: Story = {
  args: {
    gap: 8,
    children: (
      <>
        <PageColumn size="full">
          <Box className="min-h-[200px]">Main Full Content</Box>
        </PageColumn>
        <PageColumn size="small">
          <Box className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            Small Sidebar
          </Box>
        </PageColumn>
      </>
    ),
  },
};

/**
 * Three columns: small sidebar on both sides.
 */
export const ThreeColumns: Story = {
  args: {
    gap: 6,
    children: (
      <>
        <PageColumn size="small">
          <Box className="bg-blue-50 dark:bg-blue-950 border-blue-200">Left Sidebar</Box>
        </PageColumn>
        <PageColumn size="full">
          <Box className="min-h-[200px]">Primary Content</Box>
        </PageColumn>
        <PageColumn size="small">
          <Box className="bg-blue-50 dark:bg-blue-950 border-blue-200">Right Sidebar</Box>
        </PageColumn>
      </>
    ),
  },
};

/**
 * Two full-width columns sharing space equally.
 */
export const TwoFullColumns: Story = {
  args: {
    gap: 8,
    children: (
      <>
        <PageColumn size="full">
          <Box className="min-h-[200px]">Column A (full)</Box>
        </PageColumn>
        <PageColumn size="full">
          <Box className="min-h-[200px]">Column B (full)</Box>
        </PageColumn>
      </>
    ),
  },
};

/**
 * A sidebar that sticks to the top when scrolling.
 */
export const StickySidebar: Story = {
  render: (args) => (
    <div className="h-[800px] overflow-y-auto border-2 border-dashed p-4 rounded-lg">
      <p className="mb-4 text-center italic text-slate-500">Scroll down to see the sidebar stick</p>
      <PageColumns {...args} gap={8}>
        <PageColumn size="full">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 15 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Box key={i} className="min-h-[100px]">
                Main Content Block {i + 1}
              </Box>
            ))}
          </div>
        </PageColumn>
        <PageColumn sticky size="small">
          <Box className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 min-h-[300px]">
            I am a Sticky Sidebar!
          </Box>
        </PageColumn>
      </PageColumns>
    </div>
  ),
};
