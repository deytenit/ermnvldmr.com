import { Paragraph, Link, VStack, Header } from '@ermnvldmr/ui';
import React from 'react';

import { DefaultLayout } from '../components/Layout/DefaultLayout';
import { createPage } from '../lib/core/createPage';
import { SITE_DESCRIPTION, SITE_TITLE } from '../lib/shared/constants';

createPage(
  function HomePage(): React.JSX.Element {
    return (
      <DefaultLayout centerVertically headerAddonLeft={<Header level={3}>{SITE_TITLE}</Header>}>
        <VStack gap={4}>
          <Header level={2}>Welcome to my page!</Header>
          <Paragraph>
            If you see this page, my website is successfuly installed and working.
            <br />
            It will be further configured.
          </Paragraph>
          <Paragraph>
            For the source code and support please refer to{' '}
            <Link href="https://github.com/deytenit/ermnvldmr.com/">ermnvldmr.com monorepo</Link>.
            <br />
            Pictures of mine are available at{' '}
            <Link href="https://ermnvldmr.com/instagram">@deytenit</Link>.
          </Paragraph>
          <Paragraph>
            Check out my <Link href="/articles">thoughts and articles on various matters</Link>.
          </Paragraph>
          <Paragraph italic>Thank you for visiting!</Paragraph>
        </VStack>
      </DefaultLayout>
    );
  },
  { title: SITE_TITLE, description: SITE_DESCRIPTION }
);
