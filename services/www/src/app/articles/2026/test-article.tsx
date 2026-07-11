import { localePath } from '@ermnvldmr/i18n';
import { createPage } from '@ermnvldmr/ssg';
import { MARKDOWN_COMPONENTS } from '@ermnvldmr/ui';
import React from 'react';

import { articles } from '../../../../content/registry';
import { ArticleLayout } from '../../../components/Layout/ArticleLayout';

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
      currentPath={localePath('/articles/2026/test-article')}
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
