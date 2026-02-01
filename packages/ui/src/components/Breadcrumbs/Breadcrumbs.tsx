import { cn } from '@ermnvldmr/stl';
import { ChevronRight } from 'lucide-react';
import React, { memo } from 'react';

import { HStack } from '../HStack/HStack';
import { Text } from '../Text/Text';

import type { HStackProps } from '../HStack/HStack';
import type { ClassNameProps, TestIdProps } from '@ermnvldmr/stl';

/**
 * Props for the Breadcrumbs component.
 */
export interface BreadcrumbsProps extends HStackProps {
  /** Breadcrumb items and separators */
  children: React.ReactNode;
}

/**
 * Root component for hierarchical navigation.
 */
const BreadcrumbsRoot = memo(function Breadcrumbs({ children, ...props }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <HStack align="center" as="ol" gap={2} {...props}>
        {children}
      </HStack>
    </nav>
  );
});

/**
 * Individual step in the breadcrumb trail.
 */
const BreadcrumbsItem = memo(function BreadcrumbsItem({
  children,
  className,
  'data-testid': testId,
}: {
  children: React.ReactNode;
  className?: string;
} & TestIdProps) {
  return (
    <li className={className} data-testid={testId}>
      <Text color="muted" size="m" type="label">
        {children}
      </Text>
    </li>
  );
});

/**
 * Visual divider between breadcrumb items.
 */
export interface BreadcrumbsSeparatorProps extends ClassNameProps, TestIdProps {
  /** Visual variant of the separator */
  variant?: 'slash' | 'bull' | 'arrow';
}

const BreadcrumbsSeparator = memo(function BreadcrumbsSeparator({
  variant = 'slash',
  className,
  'data-testid': testId,
}: BreadcrumbsSeparatorProps) {
  const content = {
    slash: '/',
    bull: '•',
    arrow: <ChevronRight className="size-4" />,
  };

  return (
    <li
      aria-hidden="true"
      className={cn('text-[var(--rb-muted-text)]', className)}
      data-testid={testId}
    >
      <Text color="muted" size="m" type="label">
        {content[variant]}
      </Text>
    </li>
  );
});

/**
 * A hierarchical navigation component.
 *
 * Breadcrumbs provides a flexible way to display the current location within
 * a site's hierarchy. It uses a compound component pattern for maximum flexibility.
 *
 * @example
 * ```tsx
 * <Breadcrumbs>
 *   <Breadcrumbs.Item><Link href="/">Home</Link></Breadcrumbs.Item>
 *   <Breadcrumbs.Separator variant="arrow" />
 *   <Breadcrumbs.Item>Current Page</Breadcrumbs.Item>
 * </Breadcrumbs>
 * ```
 */
export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Item: BreadcrumbsItem,
  Separator: BreadcrumbsSeparator,
});
