import { Header } from '@ermnvldmr/ui';
import React, { memo } from 'react';


import type { HeaderProps } from '@ermnvldmr/ui';

/**
 * A Markdown H5 component that wraps the design system Header.
 */
export const MarkdownH5 = memo(function MarkdownH5(props: Omit<HeaderProps, 'level'>) {
  return <Header level={5} {...props} />;
});
