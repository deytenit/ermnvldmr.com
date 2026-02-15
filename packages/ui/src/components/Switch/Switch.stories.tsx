import React, { useState } from 'react';

import { Switch } from './Switch';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
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
