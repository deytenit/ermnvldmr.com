import type { HeaderProps } from '../Header/Header';
import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';
import type { ReactNode } from 'react';


/**
 * Type of accordion behavior.
 * - 'single': Only one item can be open at a time.
 * - 'multiple': Multiple items can be open at a time.
 */
export type AccordionType = 'single' | 'multiple';

/**
 * Context value for the root Accordion component.
 */
export interface AccordionContextValue {
  /** Type of accordion behavior */
  type: AccordionType;
  /** Currently open values */
  value: string[];
  /** Callback when open values change */
  onValueChange: (value: string) => void;
  /** Whether the accordion is collapsible in single mode */
  collapsible?: boolean;
}

/**
 * Context value for an individual Accordion item.
 */
export interface AccordionItemContextValue {
  /** Unique value for this item */
  value: string;
  /** Whether this item is currently open */
  isOpen: boolean;
  /** Whether this item is disabled */
  disabled?: boolean;
}

/**
 * Props for the root Accordion component.
 */
export interface AccordionProps extends ClassNameProps, TestIdProps {
  /** Content of the accordion */
  children: ReactNode;
  /** Type of accordion behavior */
  type?: AccordionType;
  /** Controlled value of open items */
  value?: string[];
  /** Default value of open items (uncontrolled) */
  defaultValue?: string[];
  /** Callback when open values change */
  onValueChange?: (value: string[]) => void;
  /** Whether the accordion is collapsible in single mode */
  collapsible?: boolean;
}

/**
 * Props for the AccordionItem component.
 */
export interface AccordionItemProps extends ClassNameProps {
  /** Unique value for this item */
  value: string;
  /** Content of the item (Trigger and Content) */
  children: ReactNode;
  /** Whether the item is disabled */
  disabled?: boolean;
}

/**
 * Props for the AccordionTrigger component.
 */
export interface AccordionTriggerProps extends ClassNameProps, Omit<HeaderProps, 'children' | 'level'> {
  /** Content of the trigger (usually text) */
  children: ReactNode;
  /**
   * The semantic header level (1-6).
   * @default 3
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Props for the AccordionContent component.
 */
export interface AccordionContentProps extends ClassNameProps {
  /** Content to be revealed */
  children: ReactNode;
}
