import { Header } from '@ermnvldmr/ui';
import React, { memo } from 'react';


import type { HeaderProps } from '@ermnvldmr/ui';

/**
 * A Markdown H6 component that wraps the design system Header.
 */
export const MarkdownH6 = memo(function MarkdownH6(props: Omit<HeaderProps, 'level'>) {
  return <Header level={6} {...props} />;
});
