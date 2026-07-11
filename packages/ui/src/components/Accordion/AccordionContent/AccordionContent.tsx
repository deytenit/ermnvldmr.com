import { cn } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import React from 'react';

import { useAccordionItemContext } from '../contexts/AccordionItemContext/AccordionItemContext';

import type { AccordionContentProps } from '../types';

const contentVariants = cva('grid transition-[grid-template-rows] duration-200 ease-out', {
  variants: {
    isOpen: {
      true: 'grid-rows-[1fr]',
      false: 'grid-rows-[0fr]',
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});

/**
 * The collapsible content of an Accordion item.
 *
 * Uses a CSS Grid transition for smooth height animation.
 * @example Basic usage:
 */
export const AccordionContent = ({ children, className }: AccordionContentProps) => {
  const { value, isOpen } = useAccordionItemContext();

  return (
    <div
      aria-hidden={!isOpen}
      aria-labelledby={`accordion-trigger-${value}`}
      className={cn(contentVariants({ isOpen }), className)}
      id={`accordion-content-${value}`}
      inert={!isOpen ? true : undefined}
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
