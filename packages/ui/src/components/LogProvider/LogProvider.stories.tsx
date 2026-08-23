import React from 'react';

import { useLogger } from './LogContext';
import { LogProvider } from './LogProvider';
import { Button } from '../Button/Button';

import type { Meta, StoryObj } from '@storybook/react';

function LogDemo(): React.JSX.Element {
  const log = useLogger();
  return (
    <Button
      variant="solid"
      onPress={() => {
        log('story-click', { timestamp: Date.now() });
      }}
    >
      Click to Log Event
    </Button>
  );
}

const meta: Meta<typeof LogProvider> = {
  title: 'Components/LogProvider',
  component: LogProvider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LogProvider>;

export const Default: Story = {
  render: () => (
    <LogProvider
      logger={(event, data) => {
        console.log(`[Event: ${event}]`, data);
      }}
    >
      <LogDemo />
    </LogProvider>
  ),
};
