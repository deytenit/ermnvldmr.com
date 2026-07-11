import React from 'react';

import { BentoGridBaseCard } from './BentoGridBaseCard';
import { Header } from '../Header/Header';
import { Text } from '../Text/Text';
import { VStack } from '../VStack/VStack';

import type { BentoCardBaseProps } from './types';

/**
 *
 */
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
 * @example Basic usage:
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
      <VStack className="h-full justify-between" gap={4}>
        <VStack gap={2}>
          {icon && <div className="text-primary-text">{icon}</div>}
          <Header level={3}>{title}</Header>
          {description && <Text className="text-muted-text" size="m">{description}</Text>}
        </VStack>
        {footer && <div className="mt-auto w-full">{footer}</div>}
      </VStack>
    </BentoGridBaseCard>
  );
};
