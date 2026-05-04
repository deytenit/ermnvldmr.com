import { cn } from '@ermnvldmr/stl';
import React from 'react';

import { BentoGridBaseCard } from './BentoGridBaseCard';
import { Header } from '../Header/Header';
import { Image } from '../Image/Image';
import { Text } from '../Text/Text';
import { VStack } from '../VStack/VStack';

import type { BentoCardBaseProps } from './types';

/**
 *
 */
export interface BentoGridImageCardProps extends BentoCardBaseProps {
  /** Source URL of the image */
  src: string;
  /** Alt text for the image */
  alt: string;
  /** Optional title to overlay on the image */
  overlayTitle?: string;
  /** Optional description to overlay on the image */
  overlayDescription?: string;
}

/**
 * A Bento card designed to showcase an image with optional textual overlays.
 * @example Basic usage:
 */
export const BentoGridImageCard = ({
  src,
  alt,
  overlayTitle,
  overlayDescription,
  className,
  ...baseProps
}: BentoGridImageCardProps) => {
  const hasOverlay = !!overlayTitle || !!overlayDescription;

  return (
    <BentoGridBaseCard {...baseProps} className={cn('p-0', className)}>
      <div className="relative h-full w-full">
        <Image
          alt={alt}
          className="h-full w-full object-cover"
          height="100%"
          ratio="auto"
          src={src}
        />
        
        {hasOverlay && (
          <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
            <VStack gap={1}>
              {overlayTitle && (
                <Header className="text-white" level={3}>
                  {overlayTitle}
                </Header>
              )}
              {overlayDescription && (
                <Text className="text-white/90" size="s">
                  {overlayDescription}
                </Text>
              )}
            </VStack>
          </div>
        )}
      </div>
    </BentoGridBaseCard>
  );
};
