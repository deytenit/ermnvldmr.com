import { ThemeSwitch } from '@ermnvldmr/kits';
import { Container, HStack, Icon, Link, Switch, Text, VStack } from '@ermnvldmr/ui';
import { Monitor, Moon, Sun } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { LocaleSwitch } from '../LocaleSwitch/LocaleSwitch';
import { RainbowSeparator } from '../RainbowSeparator';
import { t, tRaw } from './Footer.i18n';

const UMAMI_DISABLED_KEY = 'umami.disabled';

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
  const [isTelemetryEnabled, setIsTelemetryEnabled] = useState(true);

  useEffect(() => {
    try {
      setIsTelemetryEnabled(window.localStorage.getItem(UMAMI_DISABLED_KEY) !== '1');
    } catch {
      // Ignore storage access errors in restricted environments
    }

    const handleStorage = (event: StorageEvent): void => {
      if (event.key === UMAMI_DISABLED_KEY || event.key === null) {
        try {
          setIsTelemetryEnabled(window.localStorage.getItem(UMAMI_DISABLED_KEY) !== '1');
        } catch {
          // Ignore storage access errors
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleTelemetryToggle = useCallback((isSelected: boolean): void => {
    setIsTelemetryEnabled(isSelected);
    try {
      if (isSelected) {
        window.localStorage.removeItem(UMAMI_DISABLED_KEY);
      } else {
        window.localStorage.setItem(UMAMI_DISABLED_KEY, '1');
      }
    } catch {
      // Ignore storage access errors in restricted environments
    }
  }, []);

  return (
    <VStack as="footer" className="w-full" gap={0}>
      <RainbowSeparator />
      <Container bg="transparent" className="w-full max-sm:p-8" padding={12}>
        <VStack className="w-full" gap={1}>
          <HStack
            align="center"
            className="w-full max-sm:flex-col max-sm:items-start max-sm:gap-4"
            justify="between"
          >
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
          <HStack
            align="center"
            className="w-full max-sm:flex-col max-sm:items-start max-sm:gap-4"
            justify="between"
          >
            <HStack align="center" className="flex-wrap" gap={2}>
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
