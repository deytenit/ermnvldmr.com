import React from 'react';

import { List } from './List';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof List> = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof List>;

export const Unordered: Story = {
  args: {
    variant: 'unordered',
    spacing: 's',
    children: (
      <>
        <List.Item>First item</List.Item>
        <List.Item>Second item</List.Item>
        <List.Item>Third item</List.Item>
      </>
    ),
  },
};

export const Ordered: Story = {
  args: {
    variant: 'ordered',
    spacing: 's',
    children: (
      <>
        <List.Item>First item</List.Item>
        <List.Item>Second item</List.Item>
        <List.Item>Third item</List.Item>
      </>
    ),
  },
};

export const ExplicitUsage: Story = {
  render: () => (
    <div className="space-y-4">
      <List spacing="s" variant="unordered">
        <List.Item>Unordered Item 1</List.Item>
        <List.Item>Unordered Item 2</List.Item>
      </List>
      <List spacing="s" variant="ordered">
        <List.Item>Ordered Item 1</List.Item>
        <List.Item>Ordered Item 2</List.Item>
      </List>
    </div>
  ),
};

export const Nested: Story = {
  render: () => (
    <List spacing="m" variant="unordered">
      <List.Item>
        Parent Item 1
        <List className="mt-2" spacing="s" variant="unordered">
          <List.Item>Child Item 1</List.Item>
          <List.Item>Child Item 2</List.Item>
        </List>
      </List.Item>
      <List.Item>Parent Item 2</List.Item>
    </List>
  ),
};
