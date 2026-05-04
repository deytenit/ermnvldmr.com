import { cn } from '@ermnvldmr/stl';
import React from 'react';

import type { BentoCardBaseProps } from './types';

/**
 * Utility to generate Tailwind grid span classes based on props.
 * @example Generating classes:
 * ```ts
 * const classes = getSpanClasses({ colSpan: 2 });
 * ```
 */
const getSpanClasses = ({ colSpan = 1, rowSpan = 1 }: BentoCardBaseProps) => {
  const colSpans = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
  };

  const rowSpans = {
    1: 'md:row-span-1',
    2: 'md:row-span-2',
    3: 'md:row-span-3',
  };

  return cn(colSpans[colSpan], rowSpans[rowSpan]);
};

/**
 * Base card component that provides the foundational styling for all Bento cards.
 * @example Basic usage:
 */
export const BentoGridBaseCard = ({
  children,
  className,
  colSpan,
  rowSpan,
  ...props
}: BentoCardBaseProps) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-rb-outline bg-rb-base p-6 shadow-sm transition-all hover:shadow-md',
        getSpanClasses({ colSpan, rowSpan }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
