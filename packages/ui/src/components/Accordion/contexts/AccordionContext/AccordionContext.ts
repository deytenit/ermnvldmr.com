import { createContext, useContext } from 'react';

import type { AccordionContextValue } from '../../types';

/**
 * Context for sharing accordion state with items.
 */
export const AccordionContext = createContext<AccordionContextValue | null>(null);

/**
 * Hook to access the Accordion context.
 * @example Using the context:
 */
export function useAccordionContext(): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion sub-components must be used within an Accordion component.');
  }
  return context;
}
