import { Separator, Article, VStack, Breadcrumbs } from '@ermnvldmr/ui';
import React from 'react';

import { sortedArticles } from '../../../content/registry';
import { DefaultLayout } from '../../components/Layout/DefaultLayout';
import { createPage } from '../../lib/core/createPage';
import { SITE_TITLE } from '../../lib/shared/constants';

createPage(
  function ArticlesList(): React.JSX.Element {
    const breadcrumbs = (
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item isCurrent>Articles</Breadcrumbs.Item>
      </Breadcrumbs>
    );

    return (
      <DefaultLayout
        breadcrumbs={breadcrumbs}
        description="Browse all articles and projects."
        paddingY="medium"
        title="Articles"
      >
        <VStack className="w-full" gap={8}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {sortedArticles.map((article, index) => (
              <React.Fragment key={article.slug}>
                {index > 0 && index % 2 === 0 && (
                  <div className="col-span-1 py-8 md:col-span-2">
                    <Separator className="w-full" type="double" />
                  </div>
                )}
                <Article
                  additionalText={article.tags?.join(' • ')}
                  className="h-full"
                  headline={article.title}
                  href={`/articles/${article.slug}`}
                  subHeadline={article.createdDate.toLocaleDateString(undefined, {
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
        </VStack>
      </DefaultLayout>
    );
  },
  {
    title: `Articles | ${SITE_TITLE}`,
    description: 'Browse all articles and projects.',
  }
);
