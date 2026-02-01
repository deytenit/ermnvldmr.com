import { cn } from '@ermnvldmr/stl';
import React from 'react';

/**
 * Props for the Markdown component.
 */
/**
 * Props for the Markdown component.
 */
export interface MarkdownProps {
  /** The content to be rendered, typically HTML from a markdown processor. */
  children: React.ReactNode;
  /** Optional additional class names. */
  className?: string;
}

/**
 * Markdown component provides a styled container for rendered markdown content.
 * It uses the Tailwind CSS Typography plugin (prose) with custom project styles.
 *
 * @param props - The component props.
 * @param props.children
 * @param props.className
 * @returns A React element.
 * @example
 * ```tsx
 * <Markdown>
 *   <h1>Title</h1>
 *   <p>Content goes here.</p>
 * </Markdown>
 * ```
 */
export const Markdown: React.FC<MarkdownProps> = ({ children, className }) => {
  return <div className={cn(className)}>{children}</div>;
};
