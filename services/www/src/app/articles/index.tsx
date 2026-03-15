import { LOCALE, localePath } from '@ermnvldmr/i18n';
import { Article, Breadcrumbs } from '@ermnvldmr/ui';
import React from 'react';

import { t } from './index.i18n';
import { sortedArticles } from '../../../content/registry';
import { DefaultLayout } from '../../components/Layout/DefaultLayout';
import { createPage } from '../../lib/core/createPage';
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {sortedArticles.map((article) => (
          <React.Fragment key={article.slug}>
            <Article
              additionalText={article.tags?.join(' • ')}
              className="h-full"
              headline={article.title}
              href={localePath(`/articles/${article.slug}`)}
              subHeadline={article.createdDate.toLocaleDateString(DATE_LOCALE_MAP[LOCALE] ?? 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            >
              {article.description}
            </Article>
          </React.Fragment>
        ))}
      </div>
    </DefaultLayout>
  );
}

createPage(ArticlesList, {
  title: `${t('Articles')} | ${SITE_TITLE}`,
  description: t('Browse all articles and projects.'),
});
export default ArticlesList;
