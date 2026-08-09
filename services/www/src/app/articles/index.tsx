import { LOCALE, localePath } from '@ermnvldmr/i18n';
import { BentoGrid, InfoCard, Time } from '@ermnvldmr/kits';
import { createPage } from '@ermnvldmr/ssg';
import { Breadcrumbs, HStack, Separator, Text, VStack } from '@ermnvldmr/ui';
import React from 'react';

import { t } from './index.i18n';
import { sortedArticles } from '../../../content/registry';
import { DefaultLayout } from '../../components/Layout/DefaultLayout';
import { SITE_TITLE } from '../../lib/shared/constants';

const DATE_LOCALE_MAP: Record<string, string> = { en: 'en-US', ru: 'ru-RU' };

/**
 * Articles list page component.
 *
 * @example
 * ```tsx
 * createPage(ArticlesList, { title: `Articles | ${SITE_TITLE}`, description: '...' });
 * ```
 */
function ArticlesList(): React.JSX.Element {
  const breadcrumbs = (
    <Breadcrumbs>
      <Breadcrumbs.Item href={localePath('/')}>{t('Home')}</Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item isCurrent>{t('Articles')}</Breadcrumbs.Item>
    </Breadcrumbs>
  );

  return (
    <DefaultLayout
      breadcrumbs={breadcrumbs}
      currentPath={localePath('/articles')}
      description={t('Browse all articles and projects.')}
      paddingY="medium"
      title={t('Articles')}
    >
      <BentoGrid>
        {sortedArticles.map((article, index) => (
          <InfoCard
            key={article.slug}
            bg={index === 0 ? undefined : 'transparent'}
            colSpan={index === 0 ? 4 : 2}
            href={localePath(`/articles/${article.slug}`)}
            variant={index === 0 ? 'primary' : 'default'}
          >
            <InfoCard.Header>{article.title}</InfoCard.Header>
            <InfoCard.Body>{article.description}</InfoCard.Body>
            <InfoCard.Footer>
              <VStack align="stretch" gap={2}>
                <Separator thinned="thinned-end" type="single" />
                <HStack align="center" gap={4} justify="between" wrap="wrap">
                  <Time
                    color="muted"
                    date={article.createdDate}
                    locale={DATE_LOCALE_MAP[LOCALE] ?? 'en-US'}
                    size="s"
                    type="label"
                  />
                  {article.tags?.length ? (
                    <Text italic color="muted" size="s" type="label">
                      {article.tags.join(' • ')}
                    </Text>
                  ) : null}
                </HStack>
              </VStack>
            </InfoCard.Footer>
          </InfoCard>
        ))}
      </BentoGrid>
    </DefaultLayout>
  );
}

createPage(ArticlesList, {
  title: `${t('Articles')} | ${SITE_TITLE}`,
  description: t('Browse all articles and projects.'),
});
export default ArticlesList;
