import React from 'react';

import { Accordion } from './Accordion';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    collapsible: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item value="item-1">
        <Accordion.Trigger level={2}>Is it accessible?</Accordion.Trigger>
        <Accordion.Content>
          Yes. It adheres to the WAI-ARIA design pattern.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger level={2}>Is it styled?</Accordion.Trigger>
        <Accordion.Content>
          Yes. It comes with default styles that matches the design system.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Trigger level={2}>Is it animated?</Accordion.Trigger>
        <Accordion.Content>
          Yes. It uses CSS Grid transitions for smooth height animation.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
  },
  render: (args) => (
    <Accordion {...args}>
      <Accordion.Item value="item-1">
        <Accordion.Trigger level={3}>Section One</Accordion.Trigger>
        <Accordion.Content>
          This section can be open alongside others.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Trigger level={3}>Section Two</Accordion.Trigger>
        <Accordion.Content>
          You can open as many sections as you want in multiple mode.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const DifferentHeaderLevels: Story = {
  render: () => (
    <Accordion type="single">
      <Accordion.Item value="h1">
        <Accordion.Trigger level={1}>Header Level 1</Accordion.Trigger>
        <Accordion.Content>Content for H1</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="h2">
        <Accordion.Trigger level={2}>Header Level 2</Accordion.Trigger>
        <Accordion.Content>Content for H2</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="h3">
        <Accordion.Trigger level={3}>Header Level 3</Accordion.Trigger>
        <Accordion.Content>Content for H3</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="h4">
        <Accordion.Trigger level={4}>Header Level 4</Accordion.Trigger>
        <Accordion.Content>Content for H4</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Accordion type="single">
      <Accordion.Item value="item-1">
        <Accordion.Trigger level={3}>Enabled Item</Accordion.Trigger>
        <Accordion.Content>This one works fine.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item disabled value="item-2">
        <Accordion.Trigger level={3}>Disabled Item</Accordion.Trigger>
        <Accordion.Content>You should not see this.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};
