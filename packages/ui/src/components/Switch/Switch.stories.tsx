import React, { useState } from 'react';

import { Switch } from './Switch';
import { VStack } from '../VStack/VStack';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['s', 'm', 'l'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
};

export const Sizes: Story = {
  render: () => (
    <VStack gap={4}>
      <Switch size="s">Small Switch</Switch>
      <Switch size="m">Medium Switch</Switch>
      <Switch size="l">Large Switch</Switch>
    </VStack>
  ),
};

export const Selected: Story = {
  args: {
    children: 'Selected State',
    isSelected: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled State',
    isDisabled: true,
  },
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [isSelected, setSelected] = useState(false);
    return (
      <Switch isSelected={isSelected} onChange={setSelected}>
        {isSelected ? 'On' : 'Off'}
      </Switch>
    );
  },
};
