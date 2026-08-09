import { Header } from '@ermnvldmr/ui';
import React, { memo } from 'react';


import type { HeaderProps } from '@ermnvldmr/ui';

/**
 * A Markdown H2 component that wraps the design system Header.
 */
export const MarkdownH2 = memo(function MarkdownH2(props: Omit<HeaderProps, 'level'>) {
  return <Header level={2} {...props} />;
});
