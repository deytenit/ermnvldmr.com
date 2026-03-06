import React from 'react';

import { PageHead } from './PageHead';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
import { Button } from '../Button/Button';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PageHead> = {
  title: 'Components/PageHead',
  component: PageHead,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageHead>;

const dummyParagraphs = Array.from({ length: 50 }).map((_, i) => `paragraph-${i}`);

const DummyContent = () => (
  <div className="p-8">
    {dummyParagraphs.map((key) => (
      <p key={key}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    ))}
  </div>
);

export const Default: Story = {
  args: {
    heading: 'Page Title',
    caption: 'A short and inspiring caption for the page.',
    breadcrumbs: (
      <Breadcrumbs>
        <Breadcrumbs.Item>
          <a href="/">Home</a>
        </Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item>Components</Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item>PageHead</Breadcrumbs.Item>
      </Breadcrumbs>
    ),
    addonLeft: <Button variant="outline">Back</Button>,
    addonRight: <Button>Primary Action</Button>,
  },
  render: (args) => (
    <div>
      <PageHead {...args} />
      <DummyContent />
    </div>
  ),
};

export const CollapsibleSticky: Story = {
  ...Default,
  args: {
    ...Default.args,
    strategy: 'collapsible-sticky',
  },
};

export const AlwaysExpandedFixed: Story = {
  ...Default,
  args: {
    ...Default.args,
    strategy: 'always-expanded-fixed',
  },
};

export const AlwaysCollapsedSticky: Story = {
  ...Default,
  args: {
    ...Default.args,
    strategy: 'always-collapsed-sticky',
  },
};

export const WithoutAddons: Story = {
  ...Default,
  args: {
    ...Default.args,
    addonLeft: undefined,
    addonRight: undefined,
  },
};

export const WithoutBreadcrumbs: Story = {
  ...Default,
  args: {
    ...Default.args,
    breadcrumbs: undefined,
  },
};
