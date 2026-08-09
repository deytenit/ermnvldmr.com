import { Text } from '@ermnvldmr/ui';
import React from 'react';

import type { InfoCardBodyProps } from './types';

/**
 * Body sub-component for InfoCard.
 *
 * @example
 * ```tsx
 * <InfoCard.Body>Card Content</InfoCard.Body>
 * ```
 */
export function InfoCardBody({ children, className }: InfoCardBodyProps): React.JSX.Element {
  return <Text className={className}>{children}</Text>;
}
