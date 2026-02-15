import { VStack, HStack, Header, Paragraph, Link } from '@ermnvldmr/ui';
import React, { useEffect, useState } from 'react';

import { createPage } from '../lib/core/createPage';
import {
  AUTHOR_EMAIL,
  AUTHOR_NAME,
  SITE_URL,
  ERROR_TITLE,
  ERROR_DESCRIPTION,
} from '../lib/shared/constants';
import { getCurrentYear, getHttpStatusUrl } from '../lib/shared/utils';

createPage(
  function ErrorPage() {
    const [status, setStatus] = useState<number | null>(null);

    useEffect(() => {
      /**
       * Type guard for PerformanceNavigationTiming.
       * @param entry - The performance entry to check.
       * @returns True if entry is PerformanceNavigationTiming.
       * @example
       * ```typescript
       * const isNav = isNavigationTiming(entry);
       * ```
       */
      function isNavigationTiming(entry: PerformanceEntry): entry is PerformanceNavigationTiming {
        return entry.entryType === 'navigation';
      }

      const navigationData = window.performance.getEntries().find(isNavigationTiming);

      if (navigationData?.responseStatus) {
        setStatus(navigationData.responseStatus);
      }
    }, []);

    return (
      <main className="h-screen w-screen">
        <VStack align="center" className="w-full h-full" justify="center">
          <VStack align="start" gap={8}>
            <Header level={1}>
              Exceptional Situation
              {status !== null && (
                <>
                  {' '}
                  <Link href={getHttpStatusUrl(status)} size="l" type="display">
                    #{status}
                  </Link>
                </>
              )}
            </Header>{' '}
            <Paragraph>
              This location is unavailable at the moment — static content does not dwell here
            </Paragraph>
            <HStack className="w-full" justify="between">
              <span>
                <Link href={`mailto:${AUTHOR_EMAIL}`}>{AUTHOR_NAME}</Link>, {getCurrentYear()}
              </span>
              <span>
                <Link href={SITE_URL}>ermnvldmr.com</Link>
              </span>
            </HStack>
          </VStack>
        </VStack>
      </main>
    );
  },
  { title: ERROR_TITLE, description: ERROR_DESCRIPTION }
);
