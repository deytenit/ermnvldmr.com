import { cn } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import { ChevronRight } from 'lucide-react';
import React, { useRef } from 'react';
import { useButton } from 'react-aria';

import { Header } from '../../Header/Header';
import { HStack } from '../../HStack/HStack';
import { useAccordionContext } from '../contexts/AccordionContext/AccordionContext';
import { useAccordionItemContext } from '../contexts/AccordionItemContext/AccordionItemContext';

import type { AccordionTriggerProps } from '../types';

const triggerVariants = cva(
  'group flex w-full items-center justify-between py-4 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--rb-ring)] focus-visible:ring-offset-2',
  {
    variants: {
      isDisabled: {
        true: 'cursor-not-allowed opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      isDisabled: false,
    },
  }
);

const iconVariants = cva(
  'inline-icon shrink-0 transition-transform duration-200 text-[var(--rb-outline)]',
  {
    variants: {
      isOpen: {
        true: 'rotate-90',
        false: '',
      },
    },
    defaultVariants: {
      isOpen: false,
    },
  }
);

/**
 * The interactive trigger for an Accordion item.
 *
 * Wraps the Header component and adds an expansion arrow.
 * @example Basic usage:
 * ```tsx
 * <Accordion.Trigger>Click me</Accordion.Trigger>
 * ```
 */
export const AccordionTrigger = ({
  children,
  className,
  level = 3,
  ...headerProps
}: AccordionTriggerProps) => {
  const { onValueChange } = useAccordionContext();
  const { value, isOpen, disabled: isDisabled } = useAccordionItemContext();
  const ref = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    if (!isDisabled) {
      onValueChange(value);
    }
  };

  const { buttonProps } = useButton(
    {
      onPress: handleToggle,
      isDisabled,
      'aria-controls': `accordion-content-${value}`,
      'aria-expanded': isOpen,
      id: `accordion-trigger-${value}`,
      type: 'button',
    },
    ref
  );

  return (
    <Header level={level} {...headerProps}>
      <button
        {...buttonProps}
        ref={ref}
        className={cn(triggerVariants({ isDisabled }), className)}
      >
        <HStack align="center" className="w-full" gap={2}>
          <ChevronRight className={cn(iconVariants({ isOpen }))} />
          <span className="flex-1">{children}</span>
        </HStack>
      </button>
    </Header>
  );
};
