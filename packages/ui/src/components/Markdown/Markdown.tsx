import { cn } from '@ermnvldmr/stl';
import React, { memo } from 'react';

import { MarkdownA } from './MarkdownA/MarkdownA';
import { MarkdownBlockquote } from './MarkdownBlockquote/MarkdownBlockquote';
import { MarkdownCode } from './MarkdownCode/MarkdownCode';
import { MarkdownH1 } from './MarkdownH1/MarkdownH1';
import { MarkdownH2 } from './MarkdownH2/MarkdownH2';
import { MarkdownH3 } from './MarkdownH3/MarkdownH3';
import { MarkdownH4 } from './MarkdownH4/MarkdownH4';
import { MarkdownH5 } from './MarkdownH5/MarkdownH5';
import { MarkdownH6 } from './MarkdownH6/MarkdownH6';
import { MarkdownHR } from './MarkdownHR/MarkdownHR';
import { MarkdownImg } from './MarkdownImg/MarkdownImg';
import { MarkdownLI } from './MarkdownLI/MarkdownLI';
import { MarkdownOL } from './MarkdownOL/MarkdownOL';
import { MarkdownP } from './MarkdownP/MarkdownP';
import { MarkdownPre } from './MarkdownPre/MarkdownPre';
import { MarkdownTable } from './MarkdownTable/MarkdownTable';
import { MarkdownTBody } from './MarkdownTBody/MarkdownTBody';
import { MarkdownTD } from './MarkdownTD/MarkdownTD';
import { MarkdownTH } from './MarkdownTH/MarkdownTH';
import { MarkdownTHead } from './MarkdownTHead/MarkdownTHead';
import { MarkdownTR } from './MarkdownTR/MarkdownTR';
import { MarkdownUL } from './MarkdownUL/MarkdownUL';

/**
 * Props for the Markdown component.
 */
export interface MarkdownProps {
  /** The content to be rendered, typically HTML from a markdown processor. */
  children: React.ReactNode;
  /** Optional additional class names. */
  className?: string;
}

export { MARKDOWN_COMPONENTS } from './components';

const MarkdownComponent = memo(function Markdown({ children, className }: MarkdownProps) {
  return <div className={cn('flex flex-col gap-4', className)}>{children}</div>;
});

/**
 * Markdown component provides a styled container for rendered markdown content.
 *
 * It also exports all necessary sub-components for mapping HTML tags to design system components.
 *
 * @example
 * ```tsx
 * <Markdown>
 *   <Markdown.H1>Title</Markdown.H1>
 *   <Markdown.P>Content goes here.</Markdown.P>
 * </Markdown>
 *
 * // Or with Astro:
 * <Content components={MARKDOWN_COMPONENTS} />
 * ```
 */
export const Markdown = Object.assign(MarkdownComponent, {
  P: MarkdownP,
  A: MarkdownA,
  H1: MarkdownH1,
  H2: MarkdownH2,
  H3: MarkdownH3,
  H4: MarkdownH4,
  H5: MarkdownH5,
  H6: MarkdownH6,
  Blockquote: MarkdownBlockquote,
  Ul: MarkdownUL,
  Ol: MarkdownOL,
  Li: MarkdownLI,
  Table: MarkdownTable,
  THead: MarkdownTHead,
  TBody: MarkdownTBody,
  Tr: MarkdownTR,
  Th: MarkdownTH,
  Td: MarkdownTD,
  Code: MarkdownCode,
  Pre: MarkdownPre,
  Hr: MarkdownHR,
  Img: MarkdownImg,
});