import { createContext, useContext } from 'react';

import type { AccordionItemContextValue } from '../../types';

/**
 * Context for sharing specific accordion item state.
 */
export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

/**
 * Hook to access the AccordionItem context.
 */
export function useAccordionItemContext(): AccordionItemContextValue {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionItem sub-components must be used within an AccordionItem component.');
  }
  return context;
}
