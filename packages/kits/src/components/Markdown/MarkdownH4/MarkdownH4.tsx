import { Header } from '@ermnvldmr/ui';
import React, { memo } from 'react';


import type { HeaderProps } from '@ermnvldmr/ui';

/**
 * A Markdown H4 component that wraps the design system Header.
 */
export const MarkdownH4 = memo(function MarkdownH4(props: Omit<HeaderProps, 'level'>) {
  return <Header level={4} {...props} />;
});
