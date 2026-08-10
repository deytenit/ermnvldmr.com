import React from 'react';

import { BentoGrid } from './BentoGrid';
import { InfoCard } from '../InfoCard/InfoCard';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BentoGrid> = {
  title: 'Kits/BentoGrid',
  component: BentoGrid,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BentoGrid>;

export const Default: Story = {
  render: () => (
    <BentoGrid>
      <InfoCard colSpan={2}>
        <InfoCard.Header>Featured Project</InfoCard.Header>
        <InfoCard.Body>This is a 2-column wide featured bento grid item.</InfoCard.Body>
      </InfoCard>
      <InfoCard colSpan={2}>
        <InfoCard.Header>Secondary Project</InfoCard.Header>
        <InfoCard.Body>Another 2-column bento card.</InfoCard.Body>
      </InfoCard>
    </BentoGrid>
  ),
};
