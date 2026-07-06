import { VStack, HStack, Header, Paragraph, Link } from '@ermnvldmr/ui';
import React from 'react';

import { IndexLayout } from '../components/layouts/IndexLayout/IndexLayout';
import { createPage } from '@ermnvldmr/ssg';
import {
  AUTHOR_EMAIL,
  AUTHOR_NAME,
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
} from '../lib/shared/constants';
import { getCurrentYear } from '../lib/shared/utils';

function Index() {
  return (
    <IndexLayout>
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
    </IndexLayout>
  );
}

createPage(Index, { title: SITE_TITLE, description: SITE_DESCRIPTION });
export default Index;
