import React from 'react';

import { Button } from './Button';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    onPress: { action: 'pressed' },
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'link'],
    },
    color: {
      control: 'select',
      options: [
        'primary',
        'primary-negative',
        'secondary',
        'secondary-negative',
        'tertiary',
        'tertiary-negative',
        'error',
        'error-negative',
        'neutral',
        'neutral-negative',
      ],
    },
    size: {
      control: 'radio',
      options: ['s', 'm', 'l'],
    },
    rounded: {
      control: 'radio',
      options: ['none', 'md', 'full'],
    },
  },
};

export default meta;

/**
 * Story helper type.
 */
type Story = StoryObj<typeof Button>;

/**
 * The default Button story demonstrating the standard configuration.
 */
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'solid',
    color: 'primary',
    size: 'm',
  },
};

/**
 * A gallery of all available Button variants.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Button variant="solid">Solid</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link Variant</Button>
      </div>
    </div>
  ),
};

/**
 * A gallery of all available Button color themes, including negative variants.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 flex-wrap">
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="tertiary">Tertiary</Button>
        <Button color="error">Error</Button>
        <Button color="neutral">Neutral</Button>
      </div>
      <div className="flex gap-4 flex-wrap p-4 bg-slate-900 rounded">
        <Button color="primary-negative">Primary Neg</Button>
        <Button color="secondary-negative">Secondary Neg</Button>
        <Button color="tertiary-negative">Tertiary Neg</Button>
        <Button color="error-negative">Error Neg</Button>
        <Button color="neutral-negative">Neutral Neg</Button>
      </div>
    </div>
  ),
};

/**
 * A comparison of the available Button sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-end">
      <Button size="s">Small</Button>
      <Button size="m">Medium</Button>
      <Button size="l">Large</Button>
    </div>
  ),
};

/**
 * A comparison of the available border radius variants.
 */
export const Rounded: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Button rounded="none">None</Button>
      <Button rounded="md">Medium (Default)</Button>
      <Button rounded="full">Full (Pill)</Button>
    </div>
  ),
};

/**
 * Helper component to render a simple SVG icon.
 * @param className - CSS class names for styling.
 * @returns An SVG icon element.
 * @example
 * <Icon className="w-4 h-4" />
 */
const Icon = (className: string): React.ReactNode => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      d="M13 10V3L4 14h7v7l9-11h-7z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
);

/**
 * Story demonstrating the Button component with both start and end icons.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button renderStartIcon={Icon}>Start Icon</Button>
      <Button renderEndIcon={Icon}>End Icon</Button>
      <Button renderEndIcon={Icon} renderStartIcon={Icon}>
        Both Icons
      </Button>
      <Button renderStartIcon={Icon} />
    </div>
  ),
};

/**
 * Story demonstrating the Button component acting as a link (polymorphic 'a' tag).
 */
export const AsLink: Story = {
  args: {
    children: 'Go to Example',
    href: 'https://example.com',
    target: '_blank',
  },
};

/**
 * Story demonstrating the disabled state of the Button component.
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    isDisabled: true,
  },
};

/**
 * Story demonstrating the full width capability of the Button component.
 */
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
};
