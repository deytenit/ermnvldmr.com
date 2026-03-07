import React, { memo } from 'react';

import { Container } from '../Container/Container';
import { Header } from '../Header/Header';
import { Separator } from '../Separator/Separator';
import { Text } from '../Text/Text';
import { VStack } from '../VStack/VStack';

import type { ContainerProps } from '../Container/Container';
import type { ClassNameProps } from '@ermnvldmr/stl';

/**
 * Props for the Article component.
 */
export interface ArticleProps extends ClassNameProps {
  /** The main article headline */
  headline: string;
  /** Optional sub-headline displayed between separators */
  subHeadline?: string;
  /** Optional additional text (e.g., author) displayed at the bottom in gray italic label */
  additionalText?: string;
  /**
   * Press interaction handler.
   * Cannot be used with `href`.
   */
  onPress?: ContainerProps['onPress'];
  /**
   * If provided, the container will be rendered as an `<a>` tag for navigation.
   * Cannot be used with `onPress`.
   */
  href?: ContainerProps['href'];
  /** The main article body content */
  children: React.ReactNode;
}

/**
 * A article component with a structured layout.
 *
 * Features:
 * - Left-aligned medium headline (headline-m)
 * - Single-line separators with optional end fade
 * - Optional italic sub-headline (label-m)
 * - Main body text (body-m)
 * - Optional bottom gray italic label (label-s)
 * - Interactive wrapper via Container, supporting both `onPress` and `href`
 */
export const Article = memo(function Article({
  headline,
  subHeadline,
  additionalText,
  onPress,
  href,
  children,
  className,
}: ArticleProps) {
  return (
    <Container border className={className} href={href} padding={4} rounded="md" onPress={onPress}>
      <VStack align="stretch" gap={4}>
        <VStack align="stretch" gap={2}>
          <Header level={4}>{headline}</Header>
          <VStack align="stretch" gap={2}>
            {subHeadline ? (
              <>
                <Text italic size="m" type="label">
                  {subHeadline}
                </Text>
                <Separator thinned="thinned-end" type="single" />
              </>
            ) : (
              <Separator thinned="thinned-end" type="single" />
            )}
          </VStack>
        </VStack>
        <Text size="m" type="body">
          {children}
        </Text>
        {additionalText && (
          <VStack align="end">
            <Text italic color="muted" size="s" type="label">
              {additionalText}
            </Text>
          </VStack>
        )}
      </VStack>
    </Container>
  );
});
