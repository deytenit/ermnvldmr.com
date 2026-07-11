import { cn, useScroll } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
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

// Root positioning is fully determined by `strategy`:
// - `collapsible-sticky` stays in-flow so expanded content scrolls away.
// - `*-sticky` / `*-fixed` strategies pin the root to the top.
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
  const isCollapsible = strategy === 'collapsible-sticky';
  const isAlwaysCollapsed = strategy.startsWith('always-collapsed');
  const [isCollapsed, setIsCollapsed] = useState(isAlwaysCollapsed);

  useEffect(() => {
    if (isCollapsible) {
      // Trigger collapse once we've scrolled past the expanded header's height.
      // Usually around 150-200px depending on caption length. 
      // 200px ensures it won't snap until it's mostly gone.
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
      {/*
       * A single row on wide screens (title left, menu right). When the title
       * and menu can't fit together, the row wraps the menu onto its own line
       * beneath the title instead of overlapping. `whitespace-nowrap` keeps the
       * title a single unit so it's the menu that wraps, not the title that
       * shrinks. The invisible spacer copy below reserves whichever height this
       * ends up being, so page content always starts clear of the bar.
       */}
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
        {/* Expanded Content: In-flow for collapsible, or sticky/fixed for others */}
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

        {/* Collapsed Content: Fixed overlay for collapsible, or absolute/relative within sticky/fixed root */}
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

      {/*
       * Always-collapsed strategies show only the collapsed bar, which is taken
       * out of normal flow (the root is fixed, and its collapsed bar is absolute),
       * so the header reserves no height. Without this spacer, page content would
       * start at the top of the viewport, underneath the bar. Rendering an
       * invisible copy of the bar reserves exactly its height at every viewport —
       * including when it wraps to two rows — with no measurement or layout shift.
       */}
      {isAlwaysCollapsed && (
        <div aria-hidden="true" className="invisible shrink-0">
          {collapsedContent}
        </div>
      )}
    </>
  );
};
