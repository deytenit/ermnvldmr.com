import React, { memo } from 'react';

import { Separator } from '../../Separator/Separator';

import type { SeparatorProps } from '../../Separator/Separator';

/**
 * A Markdown horizontal rule component that wraps the design system Separator.
 */
export const MarkdownHR = memo(function MarkdownHR(props: SeparatorProps) {
  return <Separator className="my-8" {...props} />;
});
