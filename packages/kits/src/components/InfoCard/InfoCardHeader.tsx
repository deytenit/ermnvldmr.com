import { Header } from '@ermnvldmr/ui';
import React from 'react';

import type { InfoCardHeaderProps } from './types';

/**
 * Header sub-component for InfoCard.
 *
 * @example
 * ```tsx
 * <InfoCard.Header>Card Title</InfoCard.Header>
 * ```
 */
export function InfoCardHeader({
  children,
  icon,
  level = 3,
  className,
}: InfoCardHeaderProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-3">
      {icon && <div>{icon}</div>}
      <Header className={className} level={level}>
        {children}
      </Header>
    </div>
  );
}
