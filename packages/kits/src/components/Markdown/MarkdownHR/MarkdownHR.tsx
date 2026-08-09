import { Separator } from '@ermnvldmr/ui';
import React, { memo } from 'react';


import type { SeparatorProps } from '@ermnvldmr/ui';

/**
 * A Markdown horizontal rule component that wraps the design system Separator.
 */
export const MarkdownHR = memo(function MarkdownHR(props: SeparatorProps) {
  return <Separator className="my-8" {...props} />;
});
