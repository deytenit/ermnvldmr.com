import React from 'react';

import { Header } from '../Header/Header';
import { Text } from '../Text/Text';
import { VStack } from '../VStack/VStack';
import { BentoGridBaseCard } from './BentoGridBaseCard';
import type { BentoCardBaseProps } from './types';

export interface BentoGridInfoCardProps extends BentoCardBaseProps {
  /** The title of the card */
  title: string;
  /** The description text */
  description?: string;
  /** Optional icon or graphic to display at the top */
  icon?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
}

/**
 * A versatile Bento card for text-heavy content or feature highlights.
 */
export const BentoGridInfoCard = ({
  title,
  description,
  icon,
  footer,
  ...baseProps
}: BentoGridInfoCardProps) => {
  return (
    <BentoGridBaseCard {...baseProps}>
      <VStack gap={4} className="h-full justify-between">
        <VStack gap={2}>
          {icon && <div className="text-rb-primary-text">{icon}</div>}
          <Header level={3}>{title}</Header>
          {description && <Text size="m" className="text-rb-muted-text">{description}</Text>}
        </VStack>
        {footer && <div className="mt-auto">{footer}</div>}
      </VStack>
    </BentoGridBaseCard>
  );
};
