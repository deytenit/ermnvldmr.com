import { Container, Header, Paragraph, Link, VStack } from '@ermnvldmr/ui';
import React from 'react';

export const HomePage = (): React.JSX.Element => (
  <Container as="main" className="flex h-full w-full justify-center p-4">
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
  </Container>
);
