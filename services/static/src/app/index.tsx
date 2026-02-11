import { VStack, HStack, Header, Paragraph, Link } from '@ermnvldmr/ui';
import React from 'react';

import { createPage } from '../lib/createPage';
import {
  AUTHOR_EMAIL,
  AUTHOR_NAME,
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
} from '../shared/constants';
import { getCurrentYear } from '../shared/utils';

createPage(
  function Index() {
    return (
      <main className="h-screen w-screen">
        <VStack align="center" className="w-full h-full" justify="center">
          <VStack align="start" gap={8}>
            <Header level={1}>Static Content Dwells Here</Header>
            <Paragraph>
              Other pages direct you down specific paths to the content that resides here
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
  { title: SITE_TITLE, description: SITE_DESCRIPTION }
);
