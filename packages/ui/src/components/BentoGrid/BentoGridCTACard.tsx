import { cn } from '@ermnvldmr/stl';
import React from 'react';

import { Button } from '../Button/Button';
import { Header } from '../Header/Header';
import { Text } from '../Text/Text';
import { VStack } from '../VStack/VStack';
import { BentoGridBaseCard } from './BentoGridBaseCard';
import type { BentoCardBaseProps } from './types';

export interface BentoGridCTACardProps extends BentoCardBaseProps {
  /** The title of the call to action */
  title: string;
  /** The description text */
  description: string;
  /** The text to display on the action button */
  buttonText: string;
  /** The destination URL for the action */
  href: string;
  /** 
   * Visual variant for the card. 
   * 'default' uses standard card styling.
   * 'primary' uses a more prominent background.
   */
  variant?: 'default' | 'primary';
}

/**
 * A Bento card designed specifically to drive user action.
 */
export const BentoGridCTACard = ({
  title,
  description,
  buttonText,
  href,
  variant = 'default',
  className,
  ...baseProps
}: BentoGridCTACardProps) => {
  return (
    <BentoGridBaseCard
      {...baseProps}
      className={cn(
        variant === 'primary' && 'bg-rb-primary-base border-rb-primary-base',
        className
      )}
    >
      <VStack gap={4} className="h-full justify-between">
        <VStack gap={2}>
          <Header level={3} className={cn(variant === 'primary' && 'text-rb-primary-text')}>
            {title}
          </Header>
          <Text
            size="m"
            className={cn(variant === 'primary' ? 'text-rb-primary-text/80' : 'text-rb-muted-text')}
          >
            {description}
          </Text>
        </VStack>
        <div className="mt-auto">
          <Button
            href={href}
            variant={variant === 'primary' ? 'solid' : 'outline'}
            className="w-full sm:w-auto"
          >
            {buttonText}
          </Button>
        </div>
      </VStack>
    </BentoGridBaseCard>
  );
};
