import { cn } from '@ermnvldmr/stl';
import React from 'react';

import { Image } from '../Image/Image';
import { Header } from '../Header/Header';
import { Text } from '../Text/Text';
import { VStack } from '../VStack/VStack';
import { BentoGridBaseCard } from './BentoGridBaseCard';
import type { BentoCardBaseProps } from './types';

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
 */
export const BentoGridImageCard = ({
  src,
  alt,
  overlayTitle,
  overlayDescription,
  className,
  ...baseProps
}: BentoGridImageCardProps) => {
  const hasOverlay = overlayTitle || overlayDescription;

  return (
    <BentoGridBaseCard {...baseProps} className={cn('p-0', className)}>
      <div className="relative h-full w-full">
        <Image
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          height="100%"
          ratio="auto"
        />
        
        {hasOverlay && (
          <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
            <VStack gap={1}>
              {overlayTitle && (
                <Header level={3} className="text-white">
                  {overlayTitle}
                </Header>
              )}
              {overlayDescription && (
                <Text size="s" className="text-white/90">
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
