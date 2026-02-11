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

import type React from 'react';

/**
 * A map of HTML tags to Markdown components for use with MDX or Astro Content.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MARKDOWN_COMPONENTS: Record<string, React.ComponentType<any>> = {
  p: MarkdownP,
  a: MarkdownA,
  h1: MarkdownH1,
  h2: MarkdownH2,
  h3: MarkdownH3,
  h4: MarkdownH4,
  h5: MarkdownH5,
  h6: MarkdownH6,
  blockquote: MarkdownBlockquote,
  ul: MarkdownUL,
  ol: MarkdownOL,
  li: MarkdownLI,
  table: MarkdownTable,
  thead: MarkdownTHead,
  tbody: MarkdownTBody,
  tr: MarkdownTR,
  th: MarkdownTH,
  td: MarkdownTD,
  code: MarkdownCode,
  pre: MarkdownPre,
  hr: MarkdownHR,
  img: MarkdownImg,
};
