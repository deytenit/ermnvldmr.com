import React, { memo } from 'react';

import { Header } from '../../Header/Header';

import type { HeaderProps } from '../../Header/Header';

/**
 * A Markdown H4 component that wraps the design system Header.
 */
export const MarkdownH4 = memo(function MarkdownH4(props: Omit<HeaderProps, 'level'>) {
  return <Header level={4} {...props} />;
});
