import { cn } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import React from 'react';

/**
 * Supported width configurations for the PageContainer.
 * - `slim`: 1100px
 * - `default`: 1600px
 * - `wide`: 1920px
 * - `full`: 100%
 */
export type PageWidth = 'slim' | 'default' | 'wide' | 'full';

/**
 * Supported padding scales for the PageContainer.
 * - `none`: No padding.
 * - `small`: Standard small padding.
 * - `medium`: Standard medium padding.
 * - `large`: Standard large padding.
 */
export type PagePadding = 'none' | 'small' | 'medium' | 'large';

/**
 * Props for the PageContainer.
 */
export interface PageContainerProps {
  /** The content of the container. */
  children: React.ReactNode;
  /**
   * The maximum width of the container on desktop.
   * @default 'default'
   */
  width?: PageWidth;
  /**
   * Horizontal padding scale.
   * @default 'medium'
   */
  paddingX?: PagePadding;
  /**
   * Vertical padding scale.
   * @default 'none'
   */
  paddingY?: PagePadding;
  /**
   * If true, vertically centers the content on the page.
   * Has no effect if the content is taller than the viewport.
   * @default false
   */
  centerVertically?: boolean;
  /**
   * Optional additional class names.
   */
  className?: string;
  /**
   * The HTML element to use for the root of the component.
   * @default 'div'
   */
  as?: React.ElementType;
}

const pageContainerVariants = cva('w-full mx-auto', {
  variants: {
    width: {
      slim: 'max-w-[var(--rb-page-width-slim,1100px)]',
      default: 'max-w-[var(--rb-page-width-default,1600px)]',
      wide: 'max-w-[var(--rb-page-width-wide,1920px)]',
      full: 'max-w-full',
    },
    paddingX: {
      none: 'px-0',
      small: 'px-2 sm:px-4',
      medium: 'px-4 sm:px-6 lg:px-8',
      large: 'px-6 sm:px-8 lg:px-12',
    },
    paddingY: {
      none: 'py-0',
      small: 'py-4 sm:py-6',
      medium: 'py-8 sm:py-12',
      large: 'py-12 sm:py-24',
    },
    centerVertically: {
      true: 'flex-1 flex flex-col justify-center',
      false: '',
    },
  },
  defaultVariants: {
    width: 'default',
    paddingX: 'medium',
    paddingY: 'none',
    centerVertically: false,
  },
});

/**
 /**
 * Manages the horizontal and vertical constraints for page content.
 *
 * @param props - The component props.
 * @returns A PageContainer component.
 * @example
 * ```tsx
 * <PageContainer width="slim" paddingY="medium">
 *   Main Content
 * </PageContainer>
 * ```
 */
export const PageContainer = ({
  children,
  width = 'default',
  paddingX = 'medium',
  paddingY = 'none',
  centerVertically = false,
  className,
  as: Component = 'div',
}: PageContainerProps) => {
  return (
    <Component
      className={cn(
        pageContainerVariants({ width, paddingX, paddingY, centerVertically }),
        className
      )}
    >
      {children}
    </Component>
  );
};
