import React, { memo } from 'react';

import { Container } from '../../generic/Container/Container';
import { Header } from '../../generic/Header/Header';
import { Text } from '../../generic/Text/Text';
import { VStack } from '../../generic/VStack/VStack';
import { PaperSeparator } from '../PaperSeparator/PaperSeparator';

import type { ContainerProps } from '../../generic/Container/Container';

/**
 * Props for the newspaper-style PaperArticle component.
 */
export interface PaperArticleProps {
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
 * A newspaper-style article component with a structured layout.
 * 
 * Features:
 * - Centered medium headline (headline-m)
 * - Single-line separators
 * - Optional centered italic sub-headline (label-m)
 * - Main body text (body-m)
 * - Optional bottom gray italic label (label-s)
 * - Interactive wrapper via Container
 */
export const PaperArticle = memo(function PaperArticle({
  headline,
  subHeadline,
  additionalText,
  onPress,
  children,
}: PaperArticleProps) {
  return (
    <Container padding={4} onPress={onPress}>
      <VStack align="stretch" gap={4}>
        <Header className="text-center" level={4}>
          {headline}
        </Header>
        
          <VStack align="center" gap={2}>
            {subHeadline ? (
              <>
                  <PaperSeparator className="w-3/4" type="single" />
                  <Text italic className="text-center" size="m" type="label">
                    {subHeadline}
                  </Text>
                  <PaperSeparator className="w-3/4" type="single" />
              </>
            ) : <PaperSeparator className="w-3/4" type="single" />}
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
