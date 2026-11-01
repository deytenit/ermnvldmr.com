import { ThemeSwitch } from '@ermnvldmr/kits';
import { createLocalStorage, useLocalStorage } from '@ermnvldmr/stl';
import { Container, HStack, Icon, Link, Switch, Text, VStack } from '@ermnvldmr/ui';
import { Monitor, Moon, Sun } from 'lucide-react';
import React, { useCallback } from 'react';

import { LocaleSwitch } from '../LocaleSwitch/LocaleSwitch';
import { RainbowSeparator } from '../RainbowSeparator';
import { t, tRaw } from './Footer.i18n';

const umamiDisabledStorage = createLocalStorage<number | null>('umami.disabled', null);

/**
 * Props for the Footer component.
 */
export interface FooterProps {
  /** Current page path for locale switching. */
  currentPath?: string;
}

/**
 * The standard footer for the www service.
 * Displays copyright information, license, privacy policy, and theme switcher.
 *
 * @returns A Footer component.
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export const Footer = ({ currentPath }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const [umamiDisabled, setUmamiDisabled] = useLocalStorage(umamiDisabledStorage);
  const isTelemetryEnabled = umamiDisabled !== 1;

  const handleTelemetryToggle = useCallback(
    (isSelected: boolean): void => {
      if (isSelected) {
        umamiDisabledStorage.remove();
      } else {
        setUmamiDisabled(1);
      }
    },
    [setUmamiDisabled]
  );

  return (
    <VStack align="stretch" as="footer" gap={0}>
      <RainbowSeparator />
      <Container bg="transparent" padding={12}>
        <VStack align="stretch" gap={1}>
          <HStack align="center" gap={4} justify="between" wrap="wrap">
            <Text color="muted" size="s">
              © {currentYear} {t('Vladimir Eremin')} ·{' '}
              <Link href="https://creativecommons.org/licenses/by/4.0/" size="s">
                CC-BY 4.0
              </Link>
            </Text>
            <ThemeSwitch
              darkIcon={<Icon icon={Moon} />}
              lightIcon={<Icon icon={Sun} />}
              systemIcon={<Icon icon={Monitor} />}
            />
          </HStack>
          <HStack align="center" gap={4} justify="between" wrap="wrap">
            <HStack align="center" gap={2} wrap="wrap">
              <Text color="muted" size="s" type="label">
                {tRaw('To make this site better, I collect anonymous analytics · {privacyLink}', {
                  privacyLink: (
                    <Link
                      key="privacy-link"
                      href="https://static.ermnvldmr.com/www/privacy-policy.txt"
                      size="s"
                      type="label"
                    >
                      {t('Privacy Policy')}
                    </Link>
                  ),
                })}
              </Text>
              <Switch
                aria-label={t('Toggle anonymous telemetry')}
                isSelected={isTelemetryEnabled}
                size="s"
                variant="outline"
                onChange={handleTelemetryToggle}
              />
            </HStack>
            <LocaleSwitch currentPath={currentPath} />
          </HStack>
        </VStack>
      </Container>
    </VStack>
  );
};
