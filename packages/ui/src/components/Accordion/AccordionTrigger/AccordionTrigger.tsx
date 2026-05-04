import { cn } from '@ermnvldmr/stl';
import { ChevronRight } from 'lucide-react';
import React from 'react';

import { Header } from '../../Header/Header';
import { HStack } from '../../HStack/HStack';
import { useAccordionContext } from '../contexts/AccordionContext/AccordionContext';
import { useAccordionItemContext } from '../contexts/AccordionItemContext/AccordionItemContext';

import type { AccordionTriggerProps } from '../types';

/**
 * The interactive trigger for an Accordion item.
 *
 * Wraps the Header component and adds an expansion arrow.
 */
export const AccordionTrigger = ({
  children,
  className,
  level = 3,
  ...headerProps
}: AccordionTriggerProps) => {
  const { onValueChange } = useAccordionContext();
  const { value, isOpen, disabled } = useAccordionItemContext();

  const handleToggle = () => {
    if (!disabled) {
      onValueChange(value);
    }
  };

  return (
    <button
      aria-controls={`accordion-content-${value}`}
      aria-expanded={isOpen}
      className={cn(
        'group flex w-full items-center justify-between py-4 text-left transition-all',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled}
      id={`accordion-trigger-${value}`}
      onClick={handleToggle}
      type="button"
    >
      <HStack align="center" className="w-full" gap={2}>
        <ChevronRight
          className={cn(
            'size-5 shrink-0 transition-transform duration-200 text-[var(--rb-outline)]',
            isOpen && 'rotate-90'
          )}
        />
        <Header className="flex-1" level={level} {...headerProps}>
          {children}
        </Header>
      </HStack>
    </button>
  );
};
