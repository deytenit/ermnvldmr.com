import { PageHead } from './PageHead';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PageHead> = {
  title: 'Kits/PageHead',
  component: PageHead,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageHead>;

export const Default: Story = {
  args: {
    heading: 'Page Heading',
    caption: 'This is the page header caption description.',
  },
};
