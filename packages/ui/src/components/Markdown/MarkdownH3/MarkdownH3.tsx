import React, { memo } from 'react';

import { Header } from '../../Header/Header';

import type { HeaderProps } from '../../Header/Header';

/**
 * A Markdown H3 component that wraps the design system Header.
 */
export const MarkdownH3 = memo(function MarkdownH3(props: Omit<HeaderProps, 'level'>) {
  return <Header level={3} {...props} />;
});
