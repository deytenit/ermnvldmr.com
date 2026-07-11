import { cn } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import React from 'react';

import type { BentoCardBaseProps } from './types';

const baseCardVariants = cva(
  'relative overflow-hidden rounded-xl border border-outline bg-base p-6 shadow-sm transition-all hover:shadow-md',
  {
    variants: {
      colSpan: {
        1: 'md:col-span-1',
        2: 'md:col-span-2',
        3: 'md:col-span-3',
        4: 'md:col-span-4',
      },
      rowSpan: {
        1: 'md:row-span-1',
        2: 'md:row-span-2',
        3: 'md:row-span-3',
      },
    },
    defaultVariants: {
      colSpan: 1,
      rowSpan: 1,
    },
  }
);

/**
 * Base card component that provides the foundational styling for all Bento cards.
 * @example Basic usage:
 */
export const BentoGridBaseCard = ({
  children,
  className,
  colSpan,
  rowSpan,
  href,
  ...props
}: BentoCardBaseProps) => {
  // Render as an anchor when `href` is provided so the whole card is a link,
  // otherwise a plain div. Styling and span variants are identical either way.
  const Component: React.ElementType = href != null ? 'a' : 'div';

  return (
    <Component
      className={cn(baseCardVariants({ colSpan, rowSpan }), href != null && 'block', className)}
      href={href}
      {...props}
    >
      {children}
    </Component>
  );
};
