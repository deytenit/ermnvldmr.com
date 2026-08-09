import React from 'react';

import { InfoCard } from './InfoCard';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof InfoCard> = {
  title: 'Kits/InfoCard',
  component: InfoCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InfoCard>;

export const Default: Story = {
  render: () => (
    <InfoCard>
      <InfoCard.Header>InfoCard Title</InfoCard.Header>
      <InfoCard.Body>This is the body content of the InfoCard.</InfoCard.Body>
      <InfoCard.Footer>Footer metadata</InfoCard.Footer>
    </InfoCard>
  ),
};

export const PrimaryVariant: Story = {
  render: () => (
    <InfoCard variant="primary">
      <InfoCard.Header>Primary Featured Card</InfoCard.Header>
      <InfoCard.Body>Primary card content with brand accent background.</InfoCard.Body>
    </InfoCard>
  ),
};

export const TransparentBackground: Story = {
  render: () => (
    <InfoCard bg="transparent">
      <InfoCard.Header>Transparent Card</InfoCard.Header>
      <InfoCard.Body>Transparent surface card content.</InfoCard.Body>
    </InfoCard>
  ),
};
