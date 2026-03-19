import { cn, useScroll } from '@ermnvldmr/stl';
import React, { type ReactNode, useEffect, useState } from 'react';

import { Header } from '../../Header/Header';
import { HStack } from '../../HStack/HStack';
import { Text } from '../../Text/Text';
import { VStack } from '../../VStack/VStack';
import { PageContainer } from '../PageContainer/PageContainer';

/**
 * Defines the positioning and behavior of the PageHead component.
 * - `always-collapsed-fixed`: Always collapsed and fixed to the top.
 * - `always-collapsed-sticky`: Always collapsed and sticks to the top when scrolling.
 * - `always-expanded-fixed`: Always expanded and fixed to the top.
 * - `always-expanded-sticky`: Always expanded and sticks to the top when scrolling.
 * - `collapsible-sticky`: Starts expanded and collapses when scrolling down, sticking to the top.
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

/**
 * A universal page head component with multiple layout and behavior strategies.
 *
 * @param props - The props for the component.
 * @returns A PageHead component.
 *
 * @example
 * ```tsx
 * <PageHead
 *   heading="Page Title"
 *   caption="A short and inspiring caption"
 *   strategy="collapsible-sticky"
 * />
 * ```
 */
export const PageHead = ({
  heading,
  caption,
  breadcrumbs,
  addonLeft,
  addonRight,
  strategy = 'collapsible-sticky',
  className,
}: PageHeadProps) => {
  const { y: scrollY } = useScroll();
  const [isCollapsed, setIsCollapsed] = useState(strategy.includes('always-collapsed'));

  useEffect(() => {
    if (strategy === 'collapsible-sticky') {
      setIsCollapsed(scrollY > 10);
    }
  }, [scrollY, strategy]);

  const rootClasses = cn(
    'page-head w-full transition-all duration-200 bg-[var(--rb-background)] sticky top-0 z-10 border-b border-[var(--rb-outline)]/10',
    {
      'shadow-md bg-[var(--rb-background)]/90 backdrop-blur-md': isCollapsed,
    },
    className
  );

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
        <VStack gap={2}>
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
      <HStack align="center" className="h-14" justify="between">
        <HStack align="center" className="min-w-0 flex-1" gap={4}>
          {addonLeft && <div className="flex-shrink-0">{addonLeft}</div>}
          <Header level={4} overflow="ellipsis">
            {heading}
          </Header>
        </HStack>
        {addonRight && <div className="flex-shrink-0 ml-4">{addonRight}</div>}
      </HStack>
    </PageContainer>
  );

  return (
    <header className={rootClasses}>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          isCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
        )}
        inert={isCollapsed || undefined}
      >
        <div className="overflow-hidden">{expandedContent}</div>
      </div>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          isCollapsed ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
        inert={!isCollapsed || undefined}
      >
        <div className="overflow-hidden">{collapsedContent}</div>
      </div>
    </header>
  );
};

