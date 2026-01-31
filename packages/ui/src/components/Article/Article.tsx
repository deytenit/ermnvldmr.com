import React, { memo } from 'react';

import { Container } from '../Container/Container';
import { Header } from '../Header/Header';
import { Separator } from '../Separator/Separator';
import { Text } from '../Text/Text';
import { VStack } from '../VStack/VStack';

import type { ContainerProps } from '../Container/Container';

/**
 * Props for the Article component.
 */
export interface ArticleProps {
  /** The main article headline */
  headline: string;
  /** Optional sub-headline displayed between separators */
  subHeadline?: string;
  /** Optional additional text (e.g., author) displayed at the bottom in gray italic label */
  additionalText?: string;
  /** Press interaction handler propagated to the wrapping Container */
  onPress?: ContainerProps['onPress'];
  /** The main article body content */
  children: React.ReactNode;
}

/**
 * A article component with a structured layout.
 * 
 * Features:
 * - Centered medium headline (headline-m)
 * - Single-line separators
 * - Optional centered italic sub-headline (label-m)
 * - Main body text (body-m)
 * - Optional bottom gray italic label (label-s)
 * - Interactive wrapper via Container
 */
export const Article = memo(function Article({
  headline,
  subHeadline,
  additionalText,
  onPress,
  children,
}: ArticleProps) {
  return (
    <Container padding={4} onPress={onPress}>
      <VStack align="stretch" gap={4}>
        <Header className="text-center" level={4}>
          {headline}
        </Header>
        
          <VStack align="center" gap={2}>
            {subHeadline ? (
              <>
                  <Separator className="w-3/4" type="single" />
                  <Text italic className="text-center" size="m" type="label">
                    {subHeadline}
                  </Text>
                  <Separator className="w-3/4" type="single" />
              </>
            ) : <Separator className="w-3/4" type="single" />}
          </VStack>

        <Text size="m" type="body">
          {children}
        </Text>

        {additionalText && (
          <VStack align='end'>
            <Text italic color="muted" size="s" type="label">
              {additionalText}
            </Text>
          </VStack>
        )}
      </VStack>
    </Container>
  );
});
