import { cn } from '@ermnvldmr/stl';
import React from 'react';

import { useAccordionItemContext } from '../contexts/AccordionItemContext/AccordionItemContext';

import type { AccordionContentProps } from '../types';

/**
 * The collapsible content of an Accordion item.
 *
 * Uses a CSS Grid transition for smooth height animation.
 */
export const AccordionContent = ({ children, className }: AccordionContentProps) => {
  const { value, isOpen } = useAccordionItemContext();

  return (
    <div
      aria-labelledby={`accordion-trigger-${value}`}
      className={cn(
        'grid transition-[grid-template-rows] duration-200 ease-out',
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        className
      )}
      id={`accordion-content-${value}`}
      role="region"
    >
      <div className="overflow-hidden">
        <div className="pb-4 pt-0 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};
