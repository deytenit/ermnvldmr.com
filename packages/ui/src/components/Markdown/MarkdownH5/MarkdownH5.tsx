import React, { memo } from 'react';

import { Header } from '../../Header/Header';

import type { HeaderProps } from '../../Header/Header';

/**
 * A Markdown H5 component that wraps the design system Header.
 */
export const MarkdownH5 = memo(function MarkdownH5(props: Omit<HeaderProps, 'level'>) {
  return <Header level={5} {...props} />;
});
