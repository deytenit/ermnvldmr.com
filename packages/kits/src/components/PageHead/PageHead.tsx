import { cn, useScroll } from '@ermnvldmr/stl';
import { cva, Header, HStack, Text, VStack } from '@ermnvldmr/ui';
import React, { type ReactNode, useEffect, useState } from 'react';

import { PageContainer } from '../Page/PageContainer/PageContainer';

/**
 * Defines the positioning and behavior of the PageHead component.
 */
export type PageHeadStrategy =
  | 'always-collapsed-fixed'
  | 'always-collapsed-sticky'
  | 'always-expanded-fixed'
  | 'always-expanded-sticky'
  | 'collapsible-sticky';

/**
 * Props for the PageHead component.
 */
export interface PageHeadProps {
  /** The main heading text. */
  heading: string;
  /** The caption text displayed below the heading. */
  caption?: ReactNode;
  /** The breadcrumbs navigation component. */
  breadcrumbs?: ReactNode;
  /** A component to be displayed on the left side of the header. */
  addonLeft?: ReactNode;
  /** A component to be displayed on the right side of the header. */
  addonRight?: ReactNode;
  /** The positioning and behavior strategy for the header. */
  strategy?: PageHeadStrategy;
  /** Additional CSS classes for the component. */
  className?: string;
}

const pageHeadRootVariants = cva(
  'page-head w-full bg-[var(--rb-background)] border-b border-[var(--rb-outline)]/10',
  {
    variants: {
      strategy: {
        'always-collapsed-fixed': 'fixed top-0 z-10',
        'always-collapsed-sticky': 'sticky top-0 z-10',
        'always-expanded-fixed': 'fixed top-0 z-10',
        'always-expanded-sticky': 'sticky top-0 z-10',
        'collapsible-sticky': '',
      },
    },
    defaultVariants: {
      strategy: 'collapsible-sticky',
    },
  }
);

/**
 * A universal page head component with multiple layout and behavior strategies.
 *
 * @example
 * ```tsx
 * <PageHead heading="Title" />
 * ```
 */
export function PageHead({
  heading,
  caption,
  breadcrumbs,
  addonLeft,
  addonRight,
  strategy = 'collapsible-sticky',
  className,
}: PageHeadProps): React.JSX.Element {
  const { y: scrollY } = useScroll();
  const isCollapsible = strategy === 'collapsible-sticky';
  const isAlwaysCollapsed = strategy.startsWith('always-collapsed');
  const [isCollapsed, setIsCollapsed] = useState(isAlwaysCollapsed);

  useEffect(() => {
    if (isCollapsible) {
      setIsCollapsed(scrollY > 200);
    }
  }, [scrollY, isCollapsible]);

  const rootClasses = cn(pageHeadRootVariants({ strategy }), className);

  const expandedContent = (
    <PageContainer paddingY="medium">
      <VStack align="stretch" gap={6}>
        <HStack align="center" justify="between">
          <HStack align="center" gap={4}>
            {addonLeft && <div>{addonLeft}</div>}
            {breadcrumbs && <div className="hidden sm:block">{breadcrumbs}</div>}
          </HStack>
          {addonRight && <div>{addonRight}</div>}
        </HStack>
        <VStack gap={4}>
          <Header level={1}>{heading}</Header>
          {typeof caption === 'string' ? (
            <Text color="muted" size="l" type="body">
              {caption}
            </Text>
          ) : (
            caption
          )}
        </VStack>
      </VStack>
    </PageContainer>
  );

  const collapsedContent = (
    <PageContainer paddingY="none">
      <HStack align="center" className="py-2.5" gap={4} justify="between" wrap="wrap">
        <HStack align="center" className="flex-1" gap={4}>
          {addonLeft && <div className="flex-shrink-0 whitespace-nowrap">{addonLeft}</div>}
          <Header className="min-w-0" level={4} overflow="ellipsis">
            {heading}
          </Header>
        </HStack>
        {addonRight && <div className="flex-shrink-0">{addonRight}</div>}
      </HStack>
    </PageContainer>
  );

  return (
    <>
      <header className={rootClasses}>
        {!isAlwaysCollapsed && (
          <div
            className={cn(
              'transition-opacity duration-300',
              isCollapsible && isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            )}
          >
            {expandedContent}
          </div>
        )}

        <div
          className={cn(
            'z-20 transition-all duration-300 transform bg-[var(--rb-background)]/90 backdrop-blur-md border-b border-[var(--rb-outline)]/10 shadow-md',
            isAlwaysCollapsed || (isCollapsible && isCollapsed)
              ? 'translate-y-0 opacity-100'
              : '-translate-y-full opacity-0 pointer-events-none',
            isCollapsible ? 'fixed top-0 left-0 right-0' : 'absolute top-0 left-0 right-0'
          )}
        >
          {collapsedContent}
        </div>
      </header>

      {isAlwaysCollapsed && (
        <div aria-hidden="true" className="invisible shrink-0">
          {collapsedContent}
        </div>
      )}
    </>
  );
}
