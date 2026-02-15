import { Container, HStack, Link, ThemeSwitch, useTheme, VStack, Text, Separator } from '@ermnvldmr/ui';
import React from 'react';

/**
 * Props for the IndexLayout component.
 */
export interface IndexLayoutProps {
  /** Main content slot */
  children: React.ReactNode;
}

/**
 * The root layout for the www service.
 * Handles global theme state and provides common structure.
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
    <VStack align="center" className="min-h-screen w-screen bg-[var(--rb-background)] transition-colors duration-200" justify="between">
      <VStack align="center" as="main" className="min-h-[105vh] py-8 mx-auto" justify="start">
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
              <Link href="https://creativecommons.org/licenses/by/4.0/" size="s">
                CC-BY 4.0
              </Link>
            </VStack>
            <ThemeSwitch />
          </HStack>
        </Container>
      </VStack>
    </VStack>
  );
}
