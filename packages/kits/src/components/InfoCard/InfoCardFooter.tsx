import React from 'react';

import type { InfoCardFooterProps } from './types';

/**
 * Footer sub-component for InfoCard.
 *
 * @example
 * ```tsx
 * <InfoCard.Footer>Card Footer</InfoCard.Footer>
 * ```
 */
export function InfoCardFooter({ children, className }: InfoCardFooterProps): React.JSX.Element {
  return <div className={className}>{children}</div>;
}
