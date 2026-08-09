import { localePath } from '@ermnvldmr/i18n';
import { MARKDOWN_COMPONENTS } from '@ermnvldmr/kits';
import { createPage } from '@ermnvldmr/ssg';
import React from 'react';

import { articles } from '../../../../content/registry';
import { ArticleLayout } from '../../../components/Layout/ArticleLayout';

const article = articles['matrix-server-deployment-guide'];

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!article) {
  throw new Error('Article not found');
}

/**
 * Matrix server deployment guide article page.
 *
 * @example
 * ```tsx
 * createPage(MatrixServerDeploymentGuidePage, { title: '...', description: '...' });
 * ```
 */
function MatrixServerDeploymentGuidePage(): React.JSX.Element {
  return (
    <ArticleLayout
      createdDate={article.createdDate}
      currentPath={localePath('/articles/2026/matrix-server-deployment-guide')}
      description={article.description}
      tags={article.tags}
      title={article.title}
      updatedDate={article.updatedDate}
    >
      <article.Component components={MARKDOWN_COMPONENTS} />
    </ArticleLayout>
  );
}

createPage(MatrixServerDeploymentGuidePage, {
  title: `${article.title} - Vladimir Eremin`,
  description: article.description,
});
export default MatrixServerDeploymentGuidePage;
