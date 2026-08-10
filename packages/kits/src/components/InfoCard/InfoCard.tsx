import { castRef, cn, genericMemo } from '@ermnvldmr/stl';
import { Container, cva } from '@ermnvldmr/ui';
import React, { forwardRef } from 'react';

import { InfoCardBody } from './InfoCardBody';
import { InfoCardFooter } from './InfoCardFooter';
import { InfoCardHeader } from './InfoCardHeader';
import { InfoCardImage } from './InfoCardImage';
import { InfoCardList } from './InfoCardList';

import type { InfoCardProps } from './types';

const infoCardVariants = cva(
  'relative overflow-hidden rounded-xl border border-outline p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between gap-4',
  {
    variants: {
      variant: {
        default: '',
        primary: 'bg-primary border-primary text-primary-text',
      },
      colSpan: {
        1: 'md:col-span-1',
        2: 'md:col-span-2',
        3: 'md:col-span-3',
        4: 'md:col-span-4',
      },
      rowSpan: {
        1: 'md:row-span-1',
        2: 'md:row-span-2',
        3: 'md:row-span-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      colSpan: 1,
      rowSpan: 1,
    },
  }
);

const InfoCardRoot = forwardRef<HTMLElement, InfoCardProps>(function InfoCard(
  {
    children,
    className,
    variant,
    colSpan,
    rowSpan,
    href,
    onPress,
    ...props
  },
  ref
) {
  return (
    <Container
      {...props}
      ref={castRef<HTMLElement>(ref)}
      className={cn(infoCardVariants({ variant, colSpan, rowSpan }), className)}
      href={href}
      onPress={onPress}
    >
      {children}
    </Container>
  );
});

/**
 * A compound card component for displaying informational content, lists, or media.
 *
 * @example
 * ```tsx
 * <InfoCard>
 *   <InfoCard.Header>Title</InfoCard.Header>
 *   <InfoCard.Body>Content</InfoCard.Body>
 * </InfoCard>
 * ```
 */
export const InfoCard = Object.assign(genericMemo(InfoCardRoot), {
  Header: InfoCardHeader,
  Body: InfoCardBody,
  Footer: InfoCardFooter,
  Image: InfoCardImage,
  List: InfoCardList,
});
