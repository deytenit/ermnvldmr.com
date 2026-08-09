import { PageRoot } from '@ermnvldmr/kits';
import React from 'react';

/**
 * Props for the IndexLayout component.
 */
export interface IndexLayoutProps {
  /** Main content slot */
  children: React.ReactNode;
  /** Footer content slot */
  footer?: React.ReactNode;
}

/**
 * The root layout for the www service.
 * Handles the "peek" footer logic: the content is at least calc(100vh - 4px)
 * so the 4px rainbow border of the footer peeks into the viewport.
 *
 * @param props - The component props.
 * @returns A React element representing the index layout.
 * @example
 * ```tsx
 * <IndexLayout footer={<Footer />}>
 *   Content
 * </IndexLayout>
 * ```
 */
export function IndexLayout({ children, footer }: IndexLayoutProps): React.JSX.Element {
  return (
    <PageRoot>
      <div className="min-h-[calc(100vh-4px)] flex flex-col pb-24 max-sm:pb-12">{children}</div>
      {footer}
    </PageRoot>
  );
}
