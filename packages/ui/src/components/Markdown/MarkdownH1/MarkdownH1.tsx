import React, { memo } from 'react';

import { Header } from '../../Header/Header';

import type { HeaderProps } from '../../Header/Header';

/**
 * A Markdown H1 component that wraps the design system Header.
 */
export const MarkdownH1 = memo(function MarkdownH1(props: Omit<HeaderProps, 'level'>) {
  return <Header level={1} {...props} />;
});
