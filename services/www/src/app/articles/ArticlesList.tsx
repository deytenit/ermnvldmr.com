import { Container, Header, Link, Separator, Article } from '@ermnvldmr/ui';
import React from 'react';

import { sortedArticles } from '../../../content/registry';

export const ArticlesList = (): React.JSX.Element => (
  <Container as="main" className="mx-auto max-w-5xl px-6 py-20">
    <Header className="mb-12 text-center" level={1}>
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
  </Container>
);
