import type React from 'react';

/**
 * Common props for any React element.
 * Useful for forwarding props to dynamic components.
 */
export type ReactElementProps = React.HTMLAttributes<HTMLElement> &
  React.AllHTMLAttributes<HTMLElement>;
