import { localePath } from '@ermnvldmr/i18n';
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
 * Props for the individual Breadcrumbs item.
 */
export interface BreadcrumbsItemProps extends TestIdProps {
  /** Content to be rendered inside the item */
  children: React.ReactNode;
  /** Optional className for the list item */
  className?: string;
  /** Whether this is the current page */
  isCurrent?: boolean;
  /** Optional href for the item (renders as a link) */
  href?: string;
  /** Optional click handler for the item */
  onClick?: React.MouseEventHandler<HTMLElement>;
}

/**
 * Individual step in the breadcrumb trail.
 */
const BreadcrumbsItem = memo(function BreadcrumbsItem({
  children,
  className,
  isCurrent,
  href,
  onClick,
  'data-testid': testId,
}: BreadcrumbsItemProps) {
  const resolvedHref = href !== undefined ? localePath(href) : undefined;
  const isClickable = !!(resolvedHref ?? onClick);

  return (
    <li
      aria-current={isCurrent ? 'page' : undefined}
      className={cn(
        'group flex items-center transition-all duration-200',
        !isCurrent && isClickable && 'cursor-pointer',
        className
      )}
      data-testid={testId}
    >
      <Text
        as={resolvedHref ? 'a' : onClick ? 'button' : 'span'}
        className={cn(
          'transition-all duration-200',
          !isCurrent && 'group-hover:text-[var(--rb-text)] group-hover:underline underline-offset-4'
        )}
        color={isCurrent ? 'default' : 'muted'}
        href={resolvedHref}
        size="m"
        type="label"
        onClick={onClick}
      >
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
