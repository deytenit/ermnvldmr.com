import React, { memo } from 'react';

import { Header } from '../../Header/Header';

import type { HeaderProps } from '../../Header/Header';

/**
 * A Markdown H2 component that wraps the design system Header.
 */
export const MarkdownH2 = memo(function MarkdownH2(props: Omit<HeaderProps, 'level'>) {
  return <Header level={2} {...props} />;
});
