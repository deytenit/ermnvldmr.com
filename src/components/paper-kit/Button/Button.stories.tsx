import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

/**
 * A newspaper-style button component with italic Lato font and underlined text.
 * 
 * Features:
 * - Rectangular design with subtle background
 * - Italic Medium Lato font (500 weight) 
 * - Underlined text decoration
 * - Accessible interaction patterns via react-aria
 * - Responsive hover and focus states
 */
const meta: Meta<typeof Button> = {
  title: 'Paper Kit/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A newspaper-style button following traditional print design patterns.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
      description: 'Visual style variant',
    },
    children: {
      control: 'text',
      description: 'The button text content (string only)',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
  args: {
    children: 'Explore all the articles',
    variant: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default newspaper-style button with underlined italic text.
 */
export const Default: Story = {
  args: {
    children: 'Explore all the articles',
    onPress: () => console.log('Default button pressed'),
  },
};

/**
 * Primary variant with enhanced visual prominence.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Read more stories',
    onPress: () => console.log('Primary button pressed'),
  },
};

/**
 * Secondary variant for supporting actions.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary', 
    children: 'Subscribe now',
    onPress: () => console.log('Secondary button pressed'),
  },
};

/**
 * Disabled state of the button.
 */
export const Disabled: Story = {
  args: {
    children: 'Unavailable action',
    isDisabled: true,
  },
};

/**
 * Long text content to test text wrapping and layout.
 */
export const LongText: Story = {
  args: {
    children: 'Explore all the fascinating articles and stories from around the world',
    onPress: () => console.log('Long text button pressed'),
  },
};

/**
 * Interactive demonstration showing all variants side by side.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <Button variant="default" onPress={() => console.log('Default')}>
        Default Style
      </Button>
      <Button variant="primary" onPress={() => console.log('Primary')}>
        Primary Style  
      </Button>
      <Button variant="secondary" onPress={() => console.log('Secondary')}>
        Secondary Style
      </Button>
      <Button isDisabled>
        Disabled State
      </Button>
    </div>
  ),
};
