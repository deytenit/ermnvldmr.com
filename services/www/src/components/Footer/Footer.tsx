import { Container, HStack, Link, ThemeSwitch, VStack, Text } from '@ermnvldmr/ui';
import React from 'react';

import { LocaleSwitch } from '../LocaleSwitch/LocaleSwitch';
import { RainbowSeparator } from '../RainbowSeparator';
import { t } from './Footer.i18n';

/**
 * Props for the Footer component.
 */
export interface FooterProps {
  /** Current page path for locale switching. */
  currentPath?: string;
}

/**
 * The standard footer for the www service.
 * Displays copyright information, license, and theme switcher.
 *
 * @returns A Footer component.
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export const Footer = ({ currentPath }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <VStack as="footer" className="w-full" gap={0}>
      <RainbowSeparator />
      <Container bg="transparent" className="w-full max-sm:p-8" padding={12}>
        <HStack
          align="center"
          className="w-full max-sm:flex-col max-sm:items-start max-sm:gap-8"
          justify="between"
        >
          <VStack align="start" gap={1}>
            <Text color="muted" size="s">
              © {currentYear} {t('Vladimir Eremin')}
            </Text>
            <Link href="https://creativecommons.org/licenses/by/4.0/" size="s">
              CC-BY 4.0
            </Link>
          </VStack>
          <VStack align="end" gap={4}>
            <ThemeSwitch />
            <LocaleSwitch currentPath={currentPath} />
          </VStack>
        </HStack>
      </Container>
    </VStack>
  );
};
