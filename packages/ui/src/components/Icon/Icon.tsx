import { cn } from '@ermnvldmr/stl';
import React, { memo } from 'react';

import type { ClassNameProps } from '@ermnvldmr/stl';

/**
 * Props for the Icon component.
 */
export interface IconProps extends ClassNameProps {
  /** The icon component to render. */
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * A wrapper component for inline icons that scale with surrounding text typography.
 */
export const Icon = memo(function Icon({ icon: IconComponent, className }: IconProps) {
  return <IconComponent className={cn('inline-icon', className)} />;
});
