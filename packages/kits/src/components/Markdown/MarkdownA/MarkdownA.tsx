import { Link } from '@ermnvldmr/ui';
import React, { memo } from 'react';


import type { LinkProps } from '@ermnvldmr/ui';

/**
 * A Markdown link component that wraps the design system Link.
 */
export const MarkdownA = memo(function MarkdownA(props: LinkProps) {
  return <Link {...props} />;
});
