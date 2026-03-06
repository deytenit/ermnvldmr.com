import { Container, HStack, ThemeSwitch, useTheme, VStack, Text, Separator } from '@ermnvldmr/ui';
import React from 'react';

/**
 * Props for the IndexLayout component.
 */
export interface IndexLayoutProps {
  /** Main content slot */
  children: React.ReactNode;
}

/**
 * The root layout for the static service.
 *
 * @param props - The component props.
 * @param props.children - Main content slot.
 * @returns A React element representing the index layout.
 * @example
 * ```tsx
 * <IndexLayout>Content</IndexLayout>
 * ```
 */
export function IndexLayout({ children }: IndexLayoutProps): React.JSX.Element {
  // Initialize theme side-effects
  useTheme();

  const currentYear = new Date().getFullYear();

  return (
    <VStack
      className="min-h-screen bg-[var(--rb-background)] transition-colors duration-200"
      justify="between"
    >
      <VStack as="main" className="min-h-[105vh] w-full flex-1">
        {children}
      </VStack>
      <VStack as="footer" className="w-full" gap={0}>
        <Separator thinned={false} />
        <Container className="w-full" padding={12}>
          <HStack align="center" className="w-full" justify="between">
            <VStack align="start" gap={1}>
              <Text color="muted" size="s">
                © {currentYear} Vladimir Eremin
              </Text>
            </VStack>
            <ThemeSwitch />
          </HStack>
        </Container>
      </VStack>
    </VStack>
  );
}
