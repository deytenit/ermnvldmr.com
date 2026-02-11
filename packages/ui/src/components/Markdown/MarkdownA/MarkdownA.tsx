import React, { memo } from 'react';

import { Link } from '../../Link/Link';

import type { LinkProps } from '../../Link/Link';

/**
 * A Markdown link component that wraps the design system Link.
 */
export const MarkdownA = memo(function MarkdownA(props: LinkProps) {
  return <Link {...props} />;
});
