import { cn, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';

/**
 * Props for the BentoGrid component.
 */
export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Grid items to be rendered */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
}

const BentoGridComponent = forwardRef<HTMLDivElement, BentoGridProps>(function BentoGrid(
  { children, className, ...props },
  ref
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cn('grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4', className)}
    >
      {children}
    </div>
  );
});

/**
 * A responsive grid container layout component for bento-style card assemblies.
 */
export const BentoGrid = genericMemo(BentoGridComponent);
