import { PageContainer, PageRoot, ThemeSwitch } from '@ermnvldmr/kits';
import { HStack, Icon, Separator, Text } from '@ermnvldmr/ui';
import { Monitor, Moon, Sun } from 'lucide-react';

import type { ReactNode } from 'react';

/** Wraps each experiment in the shared header, full-width canvas, and footer. */
export function ExpLayout({ children }: { children: ReactNode }) {
  return (
    <PageRoot className="flex min-h-dvh flex-col">
      <PageContainer as="header" paddingY="small">
        <HStack align="baseline" gap={6} wrap="wrap">
          <Text size="m" type="headline">
            Experiments
          </Text>
          <Text as="a" href="/exp/anchorer" size="l" type="label" underline>
            Anchorer
          </Text>
        </HStack>
      </PageContainer>
      <Separator />
      <PageContainer as="main" className="flex-1" paddingX="none" width="full">
        {children}
      </PageContainer>
      <Separator />
      <PageContainer as="footer" paddingY="small">
        <HStack align="center" gap={4} justify="between" wrap="wrap">
          <Text as="a" href="https://ermnvldmr.com" size="l" type="label" underline>
            ermnvldmr.com
          </Text>
          <ThemeSwitch
            darkIcon={<Icon icon={Moon} />}
            lightIcon={<Icon icon={Sun} />}
            size="s"
            systemIcon={<Icon icon={Monitor} />}
          />
        </HStack>
      </PageContainer>
    </PageRoot>
  );
}
