import { MARKDOWN_COMPONENTS } from '@ermnvldmr/ui';
import React from 'react';

import { articles } from '../../../../content/registry';
import { ArticleLayout } from '../../../layouts/ArticleLayout/ArticleLayout';

export const ArticlePage = (): React.JSX.Element => {
  const article = articles['test-article'];

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!article) {
    throw new Error('Article not found');
  }

  return (
    <ArticleLayout
      createdDate={article.createdDate}
      description={article.description}
      tags={article.tags}
      title={article.title}
      updatedDate={article.updatedDate}
    >
      <article.Component components={MARKDOWN_COMPONENTS} />
    </ArticleLayout>
  );
};
