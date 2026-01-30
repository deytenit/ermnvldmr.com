import React from 'react';

import { PaperSeparator } from './PaperSeparator';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * A newspaper-style separator component for dividing content sections.
 * 
 * Features:
 * - Single or double line variants inspired by newspaper layout traditions
 * - Multiple color options (black, outline, outline-light) with theme support
 * - Horizontal and vertical orientations
 * - Optional thinned gradient fade effect at line ends (10% fade length)
 * - 2px stroke width following print design standards
 * - Semantic div elements with proper ARIA separator role for accessibility
 */
const meta: Meta<typeof PaperSeparator> = {
  title: 'components/paper/PaperSeparator',
  component: PaperSeparator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A newspaper-style separator following traditional print design patterns for content division.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'double'],
      description: 'Type of separator line styling',
    },
    color: {
      control: 'select',
      options: ['black', 'outline', 'outline-light'],
      description: 'Color variant following newspaper design patterns',
    },
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the separator',
    },
    thinned: {
      control: 'boolean',
      description: 'Whether line ends should be thinned with gradient fade (10% fade length)',
    },
  },
  args: {
    type: 'single',
    direction: 'horizontal',
    thinned: true,
  },
};

export default meta;
/**
 * Story type for PaperSeparator component stories.
 */
type Story = StoryObj<typeof meta>;

/**
 * The default single-line separator with light outline color.
 * Uses the newspaper-standard 2px stroke with thinned gradient ends.
 */
export const Default: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="w-96 p-8">
        <div className="text-center text-sm text-muted-foreground mb-4">
          Content Above
        </div>
        <Story />
        <div className="text-center text-sm text-muted-foreground mt-4">
          Content Below
        </div>
      </div>
    ),
  ],
};

/**
 * Double-line separator with standard outline color.
 * Features 4px spacing between the two parallel lines.
 */
export const Double: Story = {
  args: {
    type: 'double',
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-8">
        <div className="text-center text-sm text-muted-foreground mb-4">
          Content Above
        </div>
        <Story />
        <div className="text-center text-sm text-muted-foreground mt-4">
          Content Below
        </div>
      </div>
    ),
  ],
};

/**
 * Black color variant for high contrast content separation.
 * Most prominent separator option following newspaper header styling.
 */
export const Black: Story = {
  args: {
    color: 'black',
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-8">
        <div className="text-center text-sm text-muted-foreground mb-4">
          Content Above
        </div>
        <Story />
        <div className="text-center text-sm text-muted-foreground mt-4">
          Content Below
        </div>
      </div>
    ),
  ],
};

/**
 * Light outline color for subtle content divisions.
 * Ideal for separating related content sections.
 */
export const OutlineLight: Story = {
  args: {
    color: 'outline-light',
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-8">
        <div className="text-center text-sm text-muted-foreground mb-4">
          Content Above
        </div>
        <Story />
        <div className="text-center text-sm text-muted-foreground mt-4">
          Content Below
        </div>
      </div>
    ),
  ],
};

/**
 * Vertical separator for side-by-side content division.
 * Fills the height of its container.
 */
export const Vertical: Story = {
  args: {
    direction: 'vertical',
  },
  decorators: [
    (Story) => (
      <div className="flex h-48 p-8">
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Left Content
        </div>
        <div className="px-4">
          <Story />
        </div>
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Right Content
        </div>
      </div>
    ),
  ],
};

/**
 * Double vertical separator for enhanced visual separation.
 */
export const VerticalDouble: Story = {
  args: {
    type: 'double',
    direction: 'vertical',
  },
  decorators: [
    (Story) => (
      <div className="flex h-48 p-8">
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Left Content
        </div>
        <div className="px-4">
          <Story />
        </div>
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Right Content
        </div>
      </div>
    ),
  ],
};

/**
 * PaperSeparator without thinned ends showing clean, sharp line edges.
 * Compare with default to see the gradient fade difference.
 */
export const NonThinned: Story = {
  args: {
    thinned: false,
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-8">
        <div className="text-center text-sm text-muted-foreground mb-4">
          Content Above (Sharp Edges)
        </div>
        <Story />
        <div className="text-center text-sm text-muted-foreground mt-4">
          Content Below (Sharp Edges)
        </div>
      </div>
    ),
  ],
};

/**
 * Interactive demonstration showing all color variants side by side.
 * Useful for comparing color intensity and theme compatibility.
 */
export const AllColors: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <h3 className="text-sm font-medium mb-2">Black</h3>
        <PaperSeparator color="black" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Outline (Default for Double)</h3>
        <PaperSeparator color="outline" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Outline Light (Default for Single)</h3>
        <PaperSeparator color="outline-light" />
      </div>
    </div>
  ),
};

/**
 * Demonstration of all type variants with their default colors.
 * Shows the automatic color selection behavior.
 */
export const AllTypes: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <h3 className="text-sm font-medium mb-2">Single (Default: Outline Light)</h3>
        <PaperSeparator type="single" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Double (Default: Outline)</h3>
        <PaperSeparator type="double" />
      </div>
    </div>
  ),
};

/**
 * Comparison between thinned and non-thinned effects.
 * Demonstrates the 10% gradient fade at line ends.
 */
export const ThinnedComparison: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <h3 className="text-sm font-medium mb-2">With Thinned Ends (Default)</h3>
        <PaperSeparator thinned />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Without Thinned Ends</h3>
        <PaperSeparator thinned={false} />
      </div>
    </div>
  ),
};

/**
 * Comprehensive showcase of vertical separators in different contexts.
 * Demonstrates container height adaptation and spacing.
 */
export const VerticalShowcase: Story = {
  render: () => (
    <div className="flex space-x-8">
      <div className="flex h-32">
        <div className="flex items-center justify-center w-20 text-xs text-muted-foreground">
          Short
        </div>
        <div className="px-2">
          <PaperSeparator direction="vertical" />
        </div>
        <div className="flex items-center justify-center w-20 text-xs text-muted-foreground">
          Content
        </div>
      </div>
      
      <div className="flex h-48">
        <div className="flex items-center justify-center w-20 text-xs text-muted-foreground">
          Medium
        </div>
        <div className="px-2">
          <PaperSeparator direction="vertical" type="double" />
        </div>
        <div className="flex items-center justify-center w-20 text-xs text-muted-foreground">
          Content
        </div>
      </div>
      
      <div className="flex h-64">
        <div className="flex items-center justify-center w-20 text-xs text-muted-foreground">
          Tall
        </div>
        <div className="px-2">
          <PaperSeparator color="black" direction="vertical" />
        </div>
        <div className="flex items-center justify-center w-20 text-xs text-muted-foreground">
          Content
        </div>
      </div>
    </div>
  ),
};
