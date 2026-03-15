import { PageContainer, type PageWidth, type PagePadding } from '@ermnvldmr/ui';
import React from 'react';

import { Footer } from '../../Footer';
import { PageHead } from '../../PageHead';
import { IndexLayout } from '../IndexLayout/IndexLayout';

/**
 * Props for the DefaultLayout component.
 */
export interface DefaultLayoutProps {
  /** Main content slot */
  children: React.ReactNode;
  /** Title for the PageHead. If provided, PageHead is shown. */
  title?: string;
  /** Optional caption/description for the PageHead. */
  description?: React.ReactNode;
  /** Optional breadcrumbs for the PageHead. */
  breadcrumbs?: React.ReactNode;
  /** Optional metadata for the PageHead. */
  headerAddonLeft?: React.ReactNode;
  /**
   * The maximum width of the content.
   * @default 'default'
   */
  width?: PageWidth;
  /**
   * Vertical padding scale.
   * @default 'small'
   */
  paddingY?: PagePadding;
  /**
   * Whether to center content vertically.
   * @default false
   */
  centerVertically?: boolean;
}

/**
 * The standard layout shell for the www service.
 * Enforces a strict header/content/footer structure.
 *
 * @param props - The component props.
 * @returns A React element representing the default layout.
 * @example
 * ```tsx
 * <DefaultLayout title="My Page">
 *   Content
 * </DefaultLayout>
 * ```
 */
export function DefaultLayout({
  children,
  title,
  description,
  breadcrumbs,
  headerAddonLeft,
  width = 'default',
  paddingY = 'small',
  centerVertically = false,
}: DefaultLayoutProps): React.JSX.Element {
  return (
    <IndexLayout footer={<Footer />}>
      <PageHead
        breadcrumbs={breadcrumbs}
        caption={description}
        heading={title ?? ''}
        metadata={headerAddonLeft}
        strategy={title ? 'collapsible-sticky' : 'always-collapsed-fixed'}
      />
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
