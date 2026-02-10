import { Link } from './Link';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Link> = {
  title: 'components/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: {
    onPress: { action: 'pressed' },
  },
};

export default meta;
/**
 *
 */
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    href: 'https://example.com',
    children: 'Standard External Link',
  },
};

export const Internal: Story = {
  args: {
    href: '/internal-page',
    children: 'Internal Link',
  },
};

export const ForcedExternal: Story = {
  args: {
    href: '/forced-external',
    isExternal: true,
    children: 'Forced External Link',
  },
};

export const WithoutHref: Story = {
  args: {
    children: 'Action Link (no href)',
    onPress: () => alert('Link pressed!'),
  },
};
