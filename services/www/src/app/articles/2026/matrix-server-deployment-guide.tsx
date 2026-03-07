import { MARKDOWN_COMPONENTS } from '@ermnvldmr/ui';
import React from 'react';

import { articles } from '../../../../content/registry';
import { ArticleLayout } from '../../../components/Layout/ArticleLayout';
import { createPage } from '../../../lib/core/createPage';

const article = articles['matrix-server-deployment-guide'];

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!article) {
  throw new Error('Article not found');
}

createPage(
  function MatrixServerDeploymentGuidePage(): React.JSX.Element {
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
  },
  {
    title: `${article.title} - Vladimir Eremin`,
    description: article.description,
  }
);
