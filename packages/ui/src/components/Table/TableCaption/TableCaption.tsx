import { cn, castRef, genericMemo } from '@ermnvldmr/stl';
import React, { forwardRef } from 'react';

/**
 * A wrapper for the table caption element.
 *
 * @param props - Component properties
 * @returns The rendered table caption element
 *
 * @example
 * ```tsx
 * <Table.Caption>A list of your recent transactions.</Table.Caption>
 * ```
 */
export const TableCaption = genericMemo(
  forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
    function TableCaption({ className, children, ...props }, ref) {
      return (
        <caption
          {...props}
          ref={castRef<HTMLTableCaptionElement>(ref)}
          className={cn('mt-4 mb-4 text-sm text-[var(--rb-muted-text)]', className)}
        >
          {children}
        </caption>
      );
    }
  )
);
