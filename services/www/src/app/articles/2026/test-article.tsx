import { MARKDOWN_COMPONENTS } from '@ermnvldmr/ui';
import React from 'react';

import { articles } from '../../../../content/registry';
import { ArticleLayout } from '../../../components/Layout/ArticleLayout';
import { createPage } from '../../../lib/core/createPage';

const article = articles['test-article'];

/**
 * Test article page component.
 *
 * @example
 * ```tsx
 * createPage(TestArticlePage, { title: '...', description: '...' });
 * ```
 */
function TestArticlePage(): React.JSX.Element {
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
}

createPage(TestArticlePage, {
  title: `${article.title} - Vladimir Eremin`,
  description: article.description,
});
export default TestArticlePage;
