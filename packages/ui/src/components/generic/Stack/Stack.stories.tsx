import React from 'react';

import { Stack } from './Stack';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * A flexible layout component that arranges children using CSS Flexbox.
 * 
 * The Stack component provides a consistent, type-safe way to create flexible layouts
 * with proper spacing and alignment. It supports all major flexbox properties
 * through semantic prop names that map to Tailwind CSS utility classes.
 */
const meta: Meta<typeof Stack> = {
  title: 'components/generic/Stack',
  component: Stack,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible layout component using CSS Flexbox for consistent spacing and alignment.',
      },
    },
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'col', 'row-reverse', 'col-reverse'],
      description: 'Flexbox direction',
    },
    justify: {
      control: 'select',
      options: ['start', 'end', 'center', 'between', 'around', 'evenly'],
      description: 'Main axis alignment',
    },
    align: {
      control: 'select', 
      options: ['start', 'end', 'center', 'baseline', 'stretch'],
      description: 'Cross axis alignment',
    },
    wrap: {
      control: 'select',
      options: ['nowrap', 'wrap', 'wrap-reverse'],
      description: 'Flex wrap behavior',
    },
    gap: {
      control: 'select',
      options: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 12, 16, 20, 24],
      description: 'Spacing between items',
    },
  },
  args: {
    direction: 'row',
    justify: 'start',
    align: 'start',
    wrap: 'nowrap',
    gap: 4,
  },
};

export default meta;
/**
 *
 */
type Story = StoryObj<typeof meta>;

// Sample content components for demonstrations
const SampleBox = ({ children, color = 'bg-primary' }: { children: React.ReactNode; color?: string }): React.JSX.Element => (
  <div className={`${color} text-primary-foreground px-4 py-2 rounded text-sm font-medium min-w-16 text-center`}>
    {children}
  </div>
);

/**
 * Default horizontal stack with basic spacing.
 */
export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <SampleBox>First</SampleBox>
      <SampleBox color="bg-secondary">Second</SampleBox>
      <SampleBox color="bg-accent">Third</SampleBox>
    </Stack>
  ),
};

/**
 * Vertical stack arrangement with items stacked in a column.
 */
export const Vertical: Story = {
  args: {
    direction: 'col',
    gap: 3,
  },
  render: (args) => (
    <Stack {...args}>
      <SampleBox>Top</SampleBox>
      <SampleBox color="bg-secondary">Middle</SampleBox>
      <SampleBox color="bg-accent">Bottom</SampleBox>
    </Stack>
  ),
};

/**
 * Centered alignment on both axes.
 */
export const Centered: Story = {
  args: {
    direction: 'col',
    justify: 'center',
    align: 'center',
    gap: 4,
  },
  render: (args) => (
    <div className="h-64 w-full border-2 border-dashed border-border">
      <Stack {...args} className="h-full w-full">
        <SampleBox>Centered</SampleBox>
        <SampleBox color="bg-secondary">Content</SampleBox>
      </Stack>
    </div>
  ),
};

/**
 * Space between items with justified distribution.
 */
export const SpaceBetween: Story = {
  args: {
    direction: 'row',
    justify: 'between',
    align: 'center',
    gap: 0,
  },
  render: (args) => (
    <div className="w-80 border-2 border-dashed border-border p-4">
      <Stack {...args} className="w-full">
        <SampleBox>Start</SampleBox>
        <SampleBox color="bg-secondary">Center</SampleBox>
        <SampleBox color="bg-accent">End</SampleBox>
      </Stack>
    </div>
  ),
};

/**
 * Wrapping layout that allows items to flow to new lines.
 */
export const Wrapping: Story = {
  args: {
    direction: 'row',
    wrap: 'wrap',
    gap: 2,
  },
  render: (args) => (
    <div className="w-64 border-2 border-dashed border-border p-4">
      <Stack {...args} className="w-full">
        <SampleBox>Item 1</SampleBox>
        <SampleBox color="bg-secondary">Item 2</SampleBox>
        <SampleBox color="bg-accent">Item 3</SampleBox>
        <SampleBox color="bg-destructive">Item 4</SampleBox>
        <SampleBox>Item 5</SampleBox>
        <SampleBox color="bg-secondary">Item 6</SampleBox>
      </Stack>
    </div>
  ),
};

/**
 * Reverse direction stacks.
 */
export const Reversed: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-2">Row Reverse</h3>
        <Stack direction="row-reverse" gap={3}>
          <SampleBox>1</SampleBox>
          <SampleBox color="bg-secondary">2</SampleBox>
          <SampleBox color="bg-accent">3</SampleBox>
        </Stack>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Column Reverse</h3>
        <Stack direction="col-reverse" gap={3}>
          <SampleBox>1</SampleBox>
          <SampleBox color="bg-secondary">2</SampleBox>
          <SampleBox color="bg-accent">3</SampleBox>
        </Stack>
      </div>
    </div>
  ),
};

/**
 * Different gap sizes demonstration including decimal values.
 */
export const GapSizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">Gap: 0.5 (Decimal)</h3>
        <Stack gap={0.5}>
          <SampleBox>A</SampleBox>
          <SampleBox color="bg-secondary">B</SampleBox>
          <SampleBox color="bg-accent">C</SampleBox>
        </Stack>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Gap: 1.5 (Decimal)</h3>
        <Stack gap={1.5}>
          <SampleBox>A</SampleBox>
          <SampleBox color="bg-secondary">B</SampleBox>
          <SampleBox color="bg-accent">C</SampleBox>
        </Stack>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Gap: 2.5 (Decimal)</h3>
        <Stack gap={2.5}>
          <SampleBox>A</SampleBox>
          <SampleBox color="bg-secondary">B</SampleBox>
          <SampleBox color="bg-accent">C</SampleBox>
        </Stack>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Gap: 3.5 (Decimal)</h3>
        <Stack gap={3.5}>
          <SampleBox>A</SampleBox>
          <SampleBox color="bg-secondary">B</SampleBox>
          <SampleBox color="bg-accent">C</SampleBox>
        </Stack>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Gap: 4 (Integer)</h3>
        <Stack gap={4}>
          <SampleBox>A</SampleBox>
          <SampleBox color="bg-secondary">B</SampleBox>
          <SampleBox color="bg-accent">C</SampleBox>
        </Stack>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Gap: 8 (Large)</h3>
        <Stack gap={8}>
          <SampleBox>A</SampleBox>
          <SampleBox color="bg-secondary">B</SampleBox>
          <SampleBox color="bg-accent">C</SampleBox>
        </Stack>
      </div>
    </div>
  ),
};

/**
 * Alignment variations on the cross axis.
 */
export const AlignmentVariations: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">Align: Start</h3>
        <div className="h-20 border-2 border-dashed border-border">
          <Stack align="start" className="h-full" gap={2}>
            <SampleBox>Short</SampleBox>
            <div className="bg-secondary text-secondary-foreground px-4 py-6 rounded text-sm">Tall</div>
            <SampleBox>Short</SampleBox>
          </Stack>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Align: Center</h3>
        <div className="h-20 border-2 border-dashed border-border">
          <Stack align="center" className="h-full" gap={2}>
            <SampleBox>Short</SampleBox>
            <div className="bg-secondary text-secondary-foreground px-4 py-6 rounded text-sm">Tall</div>
            <SampleBox>Short</SampleBox>
          </Stack>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Align: Stretch</h3>
        <div className="h-20 border-2 border-dashed border-border">
          <Stack align="stretch" className="h-full" gap={2}>
            <SampleBox>Stretched</SampleBox>
            <SampleBox color="bg-secondary">Stretched</SampleBox>
            <SampleBox color="bg-accent">Stretched</SampleBox>
          </Stack>
        </div>
      </div>
    </div>
  ),
};

/**
 * Interactive playground for experimenting with all Stack properties.
 */
export const Playground: Story = {
  args: {
    direction: 'row',
    justify: 'start',
    align: 'center', 
    wrap: 'nowrap',
    gap: 4,
  },
  render: (args) => (
    <div className="w-96 h-64 border-2 border-dashed border-border p-4">
      <Stack {...args} className="h-full w-full">
        <SampleBox>One</SampleBox>
        <SampleBox color="bg-secondary">Two</SampleBox>
        <SampleBox color="bg-accent">Three</SampleBox>
        <SampleBox color="bg-destructive">Four</SampleBox>
      </Stack>
    </div>
  ),
};
