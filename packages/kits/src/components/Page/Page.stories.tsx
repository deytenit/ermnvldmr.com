import React from 'react';

import { PageColumn, PageColumns, PageContainer, PageRoot } from './index';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PageRoot> = {
  title: 'Kits/Page',
  component: PageRoot,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageRoot>;

export const Default: Story = {
  render: () => (
    <PageRoot>
      <PageContainer width="default">
        <PageColumns>
          <PageColumn size="full">Main Column Content</PageColumn>
          <PageColumn size="small">Sidebar Content</PageColumn>
        </PageColumns>
      </PageContainer>
    </PageRoot>
  ),
};
