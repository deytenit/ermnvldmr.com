import { cn, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';

import { BentoGridBaseCard } from './BentoGridBaseCard';
import { BentoGridCTACard } from './BentoGridCTACard';
import { BentoGridImageCard } from './BentoGridImageCard';
import { BentoGridInfoCard } from './BentoGridInfoCard';
import { BentoGridListCard } from './BentoGridListCard';
import type { BentoGridProps } from './types';

const BentoGridComponent = forwardRef<HTMLDivElement, BentoGridProps>(function BentoGrid(
  { children, className, ...props },
  ref
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        'grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  );
});

/**
 * A responsive Bento Grid system for creating structured, masonry-like layouts.
 *
 * @example
 * ```tsx
 * <BentoGrid>
 *   <BentoGrid.ImageCard
 *     colSpan={2}
 *     rowSpan={2}
 *     src="/image.jpg"
 *     alt="Showcase"
 *     overlayTitle="Featured"
 *   />
 *   <BentoGrid.InfoCard
 *     title="Details"
 *     description="Key features of the project."
 *   />
 * </BentoGrid>
 * ```
 */
export const BentoGrid = Object.assign(genericMemo(BentoGridComponent), {
  BaseCard: BentoGridBaseCard,
  ImageCard: BentoGridImageCard,
  InfoCard: BentoGridInfoCard,
  CTACard: BentoGridCTACard,
  ListCard: BentoGridListCard,
});
