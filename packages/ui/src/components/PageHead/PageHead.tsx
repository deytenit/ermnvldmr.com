import { cn, useScroll, useResizeObserver } from '@ermnvldmr/stl';
import React, { type ReactNode, useRef, useEffect, useState } from 'react';

import { Header } from '../Header/Header';
import { HStack } from '../HStack/HStack';
import { Text } from '../Text/Text';
import { VStack } from '../VStack/VStack';

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
  caption?: string;
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
  const headerRef = useRef<HTMLDivElement>(null);
  const { height } = useResizeObserver(headerRef);

  useEffect(() => {
    if (strategy === 'collapsible-sticky') {
      setIsCollapsed(scrollY > 10);
    }
  }, [scrollY, strategy]);

  const rootClasses = cn(
    'page-head w-full transition-all duration-200 bg-[var(--rb-background)] fixed top-0 z-10',
    {
      'px-6 py-4': !isCollapsed,
      'px-4 py-2': isCollapsed,
      'shadow-md': isCollapsed,
    },
    className
  );

  return (
    <>
      <header ref={headerRef} className={rootClasses}>
        <div
          className={cn('transition-opacity duration-200', {
            'opacity-0 hidden': isCollapsed,
            'opacity-100': !isCollapsed,
          })}
        >
          <VStack align="stretch" gap={2}>
            <HStack align="center" justify="between">
              <HStack align="center" gap={4}>
                {addonLeft && <div>{addonLeft}</div>}
                {breadcrumbs && <div>{breadcrumbs}</div>}
              </HStack>
              {addonRight && <div>{addonRight}</div>}
            </HStack>
            <VStack gap={2}>
              <Header level={1}>{heading}</Header>
              {caption && (
                <Text color="muted" size="l" type="body">
                  {caption}
                </Text>
              )}
            </VStack>
          </VStack>
        </div>
        <div
          className={cn('transition-opacity duration-200', {
            'opacity-100': isCollapsed,
            'opacity-0 hidden': !isCollapsed,
          })}
        >
          <HStack align="center" justify="between">
            <HStack align="center" gap={2}>
              {addonLeft && <div>{addonLeft}</div>}
              <Header level={3}>{heading}</Header>
            </HStack>
            {addonRight && <div>{addonRight}</div>}
          </HStack>
        </div>
      </header>
      <div style={{ height }} />
    </>
  );
};
