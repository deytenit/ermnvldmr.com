import { Header } from '@ermnvldmr/ui';
import React, { memo } from 'react';


import type { HeaderProps } from '@ermnvldmr/ui';

/**
 * A Markdown H1 component that wraps the design system Header.
 */
export const MarkdownH1 = memo(function MarkdownH1(props: Omit<HeaderProps, 'level'>) {
  return <Header level={1} {...props} />;
});
