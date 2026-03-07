import { PageContainer, type PageWidth, type PagePadding } from '@ermnvldmr/ui';
import React from 'react';

import { Footer } from '../../Footer';
import { IndexLayout } from '../IndexLayout/IndexLayout';

/**
 * Props for the MinimalLayout component.
 */
export interface MinimalLayoutProps {
  /** Main content slot */
  children: React.ReactNode;
  /**
   * The maximum width of the content.
   * @default 'default'
   */
  width?: PageWidth;
  /**
   * Vertical padding scale.
   * @default 'none'
   */
  paddingY?: PagePadding;
  /**
   * Whether to center content vertically.
   * @default false
   */
  centerVertically?: boolean;
}

/**
 /**
 * A minimal layout containing content and a footer.
 * Useful for landing pages or high-focus content.
 *
 * @param props - The component props.
 * @returns A React element representing the minimal layout.
 * @example
 * ```tsx
 * <MinimalLayout>
 *   Content
 * </MinimalLayout>
 * ```
 */
export function MinimalLayout({
  children,
  width = 'default',
  paddingY = 'none',
  centerVertically = false,
}: MinimalLayoutProps): React.JSX.Element {
  return (
    <IndexLayout footer={<Footer />}>
      <PageContainer
        as="main"
        centerVertically={centerVertically}
        paddingY={paddingY}
        width={width}
      >
        {children}
      </PageContainer>
    </IndexLayout>
  );
}
