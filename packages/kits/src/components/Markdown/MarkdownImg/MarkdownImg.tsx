import { Image } from '@ermnvldmr/ui';
import React, { memo } from 'react';


import type { ImageProps } from '@ermnvldmr/ui';

/**
 * A Markdown image component that wraps the design system Image.
 *
 * Note: Markdown usually only provides src and alt. Default constraints
 * might be needed if they are not provided by the processor.
 */
export const MarkdownImg = memo(function MarkdownImg(props: ImageProps) {
  // Default values for common Markdown images to prevent CLS
  // if specific dimensions aren't provided.
  return <Image rounded="md" shadow="sm" {...props} />;
});
