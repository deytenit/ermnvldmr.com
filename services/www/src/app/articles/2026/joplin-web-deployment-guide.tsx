import { localePath } from '@ermnvldmr/i18n';
import { MARKDOWN_COMPONENTS } from '@ermnvldmr/ui';
import React from 'react';

import { articles } from '../../../../content/registry';
import { ArticleLayout } from '../../../components/Layout/ArticleLayout';
import { createPage } from '@ermnvldmr/ssg';

const article = articles['joplin-web-deployment-guide'];

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!article) {
  throw new Error('Article not found');
}

/**
 * Joplin web deployment guide article page.
 *
 * @example
 * ```tsx
 * createPage(JoplinWebDeploymentGuidePage, { title: '...', description: '...' });
 * ```
 */
function JoplinWebDeploymentGuidePage(): React.JSX.Element {
  return (
    <ArticleLayout
      createdDate={article.createdDate}
      currentPath={localePath('/articles/2026/joplin-web-deployment-guide')}
      description={article.description}
      tags={article.tags}
      title={article.title}
      updatedDate={article.updatedDate}
    >
      <article.Component components={MARKDOWN_COMPONENTS} />
    </ArticleLayout>
  );
}

createPage(JoplinWebDeploymentGuidePage, {
  title: `${article.title} - Vladimir Eremin`,
  description: article.description,
});
export default JoplinWebDeploymentGuidePage;
