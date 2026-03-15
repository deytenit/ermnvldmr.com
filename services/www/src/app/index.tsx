import { localePath } from '@ermnvldmr/i18n';
import { Paragraph, Link, VStack, Header } from '@ermnvldmr/ui';
import React from 'react';

import { t, tRaw } from './index.i18n';
import { DefaultLayout } from '../components/Layout/DefaultLayout';
import { createPage } from '../lib/core/createPage';
import { SITE_TITLE } from '../lib/shared/constants';

/**
 * Home page component.
 *
 * @example
 * ```tsx
 * createPage(HomePage, { title: SITE_TITLE, description: t('Thoughts and creations of mine') });
 * ```
 */
function HomePage(): React.JSX.Element {
  return (
    <DefaultLayout
      centerVertically
      currentPath={localePath('/')}
      headerAddonLeft={<Header level={3}>{SITE_TITLE}</Header>}
    >
      <VStack gap={24}>
        <Header delay={0} level={1}>
          {t('Welcome to my corner of the internet.')}
        </Header>
        <VStack gap={12}>
          <Paragraph delay={300} size="l" type="title">
            {t(
              'You arrived right as the lights turned on. The core foundation is solid and the site is officially live, but the metaphorical boxes are still being unpacked. Expect this space to evolve continuously as everything finds its proper place.'
            )}
          </Paragraph>
          <Paragraph delay={350} size="l" type="title">
            {tRaw(
              'Sharing the underlying architecture is a core philosophy here. If you are curious about the specifics of how it is all built, you can inspect the {repositoryLink} to see the complete blueprints.',
              {
                repositoryLink: (
                  <Link href="https://github.com/deytenit/ermnvldmr.com/" size="l" type="title">
                    {t('ermnvldmr.com repository')}
                  </Link>
                ),
              }
            )}
          </Paragraph>
          <Paragraph delay={400} size="l" type="title">
            {tRaw(
              'For a look at the world away from terminal screens and code editors, the {instagramLink} visual diary captures those moments.',
              {
                instagramLink: (
                  <Link href="https://ermnvldmr.com/instagram" size="l" type="title">
                    @deytenit
                  </Link>
                ),
              }
            )}
          </Paragraph>
          <Paragraph delay={450} size="l" type="title">
            {tRaw(
              'Whenever you are ready to look around, feel free to dive into {articlesLink}. It is a dedicated space covering everything from technical deep-dives to everyday reflections.',
              {
                articlesLink: (
                  <Link href={localePath('/articles')} size="l" type="title">
                    {t('the growing collection of articles')}
                  </Link>
                ),
              }
            )}
          </Paragraph>
          <Paragraph delay={500} size="l" type="title">
            {t(
              'Even though the rest of the environment is still a work in progress, the communication lines are fully operational. Whether you want to discuss tech, share a perspective on a recent read, or simply make a connection, the mailbox is open at...'
            )}
          </Paragraph>
        </VStack>
        <Link delay={1000} href="mailto:personal@ermnvldmr.com" size="l" type="title">
          personal@ermnvldmr.com
        </Link>
      </VStack>
    </DefaultLayout>
  );
}

createPage(HomePage, { title: SITE_TITLE, description: t('Thoughts and creations of mine') });
export default HomePage;
