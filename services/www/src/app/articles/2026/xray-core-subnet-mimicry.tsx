import { localePath } from '@ermnvldmr/i18n';
import { MARKDOWN_COMPONENTS } from '@ermnvldmr/kits';
import { createPage } from '@ermnvldmr/ssg';
import React from 'react';

import { articles } from '../../../../content/registry';
import { ArticleLayout } from '../../../components/Layout/ArticleLayout';

const article = articles['xray-core-subnet-mimicry'];

/**
 * Xray Core subnet mimicry article page.
 *
 * @example
 * ```tsx
 * createPage(XrayCoreSubnetMimicryPage, { title: '...', description: '...' });
 * ```
 */
function XrayCoreSubnetMimicryPage(): React.JSX.Element {
  return (
    <ArticleLayout
      createdDate={article.createdDate}
      currentPath={localePath('/articles/2026/xray-core-subnet-mimicry')}
      description={article.description}
      tags={article.tags}
      title={article.title}
      updatedDate={article.updatedDate}
    >
      <article.Component components={MARKDOWN_COMPONENTS} />
    </ArticleLayout>
  );
}

createPage(XrayCoreSubnetMimicryPage, {
  title: `${article.title} - Vladimir Eremin`,
  description: article.description,
});
export default XrayCoreSubnetMimicryPage;
