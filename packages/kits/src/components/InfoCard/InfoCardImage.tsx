import { Header, Image, Text, VStack } from '@ermnvldmr/ui';
import React from 'react';

import type { InfoCardImageProps } from './types';

/**
 * Image overlay sub-component for InfoCard.
 *
 * @example
 * ```tsx
 * <InfoCard.Image alt="Image" src="image.jpg" />
 * ```
 */
export function InfoCardImage({
  src,
  alt,
  overlayTitle,
  overlayDescription,
  className,
}: InfoCardImageProps): React.JSX.Element {
  const hasOverlay = Boolean(overlayTitle ?? overlayDescription);

  return (
    <div className={`relative h-full w-full ${className ?? ''}`}>
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
  );
}
