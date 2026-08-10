import { cn } from '@ermnvldmr/stl';
import { useTheme } from '@ermnvldmr/ui';
import React from 'react';

/**
 * Props for the PageRoot component.
 */
export interface PageRootProps {
  /** The main content slot. */
  children: React.ReactNode;
  /** Additional CSS classes for the root container. */
  className?: string;
}

/**
 /**
 * The technical bootstrap layer for all layouts.
 * It handles theme initialization and base background/text colors.
 *
 * @param props - The component props.
 * @returns A PageRoot component.
 * @example
 * ```tsx
 * <PageRoot>
 *   <PageContainer>Content</PageContainer>
 * </PageRoot>
 * ```
 */
export const PageRoot = ({ children, className }: PageRootProps) => {
  useTheme();

  return <div className={cn('w-full transition-colors duration-200', className)}>{children}</div>;
};
