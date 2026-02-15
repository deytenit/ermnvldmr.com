import { Header, Link, Separator, Article , VStack } from '@ermnvldmr/ui';
import React from 'react';

import { sortedArticles } from '../../../content/registry';
import { IndexLayout } from '../../components/layouts/IndexLayout/IndexLayout';
import { createPage } from '../../lib/core/createPage';
import { SITE_TITLE } from '../../lib/shared/constants';

createPage(
  function ArticlesList(): React.JSX.Element {
    return (
      <IndexLayout>
        <VStack className="w-full" gap={8}>
          <Header level={1}>
            Articles
          </Header>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {sortedArticles.map((article, index) => (
              <React.Fragment key={article.slug}>
                {index > 0 && index % 2 === 0 && (
                  <div className="col-span-1 py-8 md:col-span-2">
                    <Separator className="w-full" type="double" />
                  </div>
                )}
                <Link className="group block h-full no-underline!" href={`/articles/${article.slug}`}>
                  <Article
                    additionalText={article.tags?.join(' • ')}
                    headline={article.title}
                    subHeadline={article.createdDate.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  >
                    {article.description}
                  </Article>
                </Link>
              </React.Fragment>
            ))}
          </div>
        </VStack>
      </IndexLayout>
    );
  },
  {
    title: `Articles | ${SITE_TITLE}`,
    description: 'Browse all articles and projects.',
  }
);
