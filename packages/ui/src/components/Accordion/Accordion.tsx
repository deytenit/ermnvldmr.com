import { cn } from '@ermnvldmr/stl';
import React, { useState, useCallback, useMemo } from 'react';

import { AccordionContent } from './AccordionContent/AccordionContent';
import { AccordionItem } from './AccordionItem/AccordionItem';
import { AccordionTrigger } from './AccordionTrigger/AccordionTrigger';
import { AccordionContext } from './contexts/AccordionContext/AccordionContext';

import type { AccordionProps } from './types';

/**
 * An Accordion component that allows users to reveal and hide content sections.
 *
 * Built with a compound component pattern for maximum flexibility.
 * @example Basic usage:
 */
const AccordionRoot = ({
  type = 'single',
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  collapsible = true,
  children,
  className,
  'data-testid': testId,
}: AccordionProps) => {
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);

  const isControlled = controlledValue !== undefined;
  const currentValues = isControlled ? controlledValue : internalValue;

  const handleValueChange = useCallback(
    (itemValue: string) => {
      let nextValues: string[];

      if (type === 'single') {
        const isCurrentOpen = currentValues.includes(itemValue);
        if (isCurrentOpen && collapsible) {
          nextValues = [];
        } else if (isCurrentOpen && !collapsible) {
          nextValues = [itemValue];
        } else {
          nextValues = [itemValue];
        }
      } else {
        nextValues = currentValues.includes(itemValue)
          ? currentValues.filter((v) => v !== itemValue)
          : [...currentValues, itemValue];
      }

      if (!isControlled) {
        setInternalValue(nextValues);
      }
      onValueChange?.(nextValues);
    },
    [type, currentValues, collapsible, isControlled, onValueChange]
  );

  const contextValue = useMemo(
    () => ({
      type,
      value: currentValues,
      onValueChange: handleValueChange,
      collapsible,
    }),
    [type, currentValues, handleValueChange, collapsible]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn('w-full', className)} data-testid={testId}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

/**
 * A collapsible accordion component system.
 *
 * @example
 * ```tsx
 * <Accordion type="single" collapsible>
 *   <Accordion.Item value="item-1">
 *     <Accordion.Trigger level={2}>Is it accessible?</Accordion.Trigger>
 *     <Accordion.Content>Yes. It adheres to the WAI-ARIA design pattern.</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 */
export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
