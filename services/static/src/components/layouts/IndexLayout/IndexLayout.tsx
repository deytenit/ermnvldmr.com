import { Container, HStack, ThemeSwitch, VStack, Text, Separator, PageRoot } from '@ermnvldmr/ui';
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
 * @returns A React element representing the index layout.
 * @example
 * ```tsx
 * <IndexLayout>Content</IndexLayout>
 * ```
 */
export function IndexLayout({ children }: IndexLayoutProps): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <PageRoot className="flex flex-col justify-between">
      <main className="flex-1 w-full">{children}</main>
      <VStack as="footer" className="w-full" gap={0}>
        <Separator thinned="none" />
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
    </PageRoot>
  );
}
