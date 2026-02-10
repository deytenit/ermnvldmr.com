import React, { memo } from 'react';

import { Header } from '../../Header/Header';

import type { HeaderProps } from '../../Header/Header';

/**
 * A Markdown H6 component that wraps the design system Header.
 */
export const MarkdownH6 = memo(function MarkdownH6(props: Omit<HeaderProps, 'level'>) {
  return <Header level={6} {...props} />;
});
