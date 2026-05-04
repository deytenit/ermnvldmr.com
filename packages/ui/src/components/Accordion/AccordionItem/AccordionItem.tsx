import { cn } from '@ermnvldmr/stl';
import React, { useMemo } from 'react';

import { useAccordionContext } from '../contexts/AccordionContext/AccordionContext';
import { AccordionItemContext } from '../contexts/AccordionItemContext/AccordionItemContext';

import type { AccordionItemProps } from '../types';

/**
 * An individual item within an Accordion.
 *
 * Provides context for the Trigger and Content sub-components.
 */
export const AccordionItem = ({
  value,
  children,
  disabled = false,
  className,
}: AccordionItemProps) => {
  const { value: openValues } = useAccordionContext();
  const isOpen = openValues.includes(value);

  const contextValue = useMemo(
    () => ({
      value,
      isOpen,
      disabled,
    }),
    [value, isOpen, disabled]
  );

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <div className={cn('border-b border-[var(--rb-outline)]/40', className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};
