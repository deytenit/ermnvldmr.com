import { cn } from '@ermnvldmr/stl';
import React from 'react';

import { BentoGridBaseCard } from './BentoGridBaseCard';
import { Button } from '../Button/Button';
import { Header } from '../Header/Header';
import { Text } from '../Text/Text';
import { VStack } from '../VStack/VStack';

import type { BentoCardBaseProps } from './types';

/**
 *
 */
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
 * @example Basic usage:
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
      <VStack className="h-full justify-between" gap={4}>
        <VStack gap={2}>
          <Header className={cn(variant === 'primary' && 'text-rb-primary-text')} level={3}>
            {title}
          </Header>
          <Text
            className={cn(variant === 'primary' ? 'text-rb-primary-text/80' : 'text-rb-muted-text')}
            size="m"
          >
            {description}
          </Text>
        </VStack>
        <div className="mt-auto">
          <Button
            className="w-full sm:w-auto"
            href={href}
            variant={variant === 'primary' ? 'solid' : 'outline'}
          >
            {buttonText}
          </Button>
        </div>
      </VStack>
    </BentoGridBaseCard>
  );
};
