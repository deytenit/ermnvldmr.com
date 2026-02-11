import { ArticlePage } from './ArticlePage';
import { articles } from '../../../../content/registry';
import { createPage } from '../../../lib/createPage';

const article = articles['test-article'];

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!article) {
  throw new Error('Article not found');
}

createPage(ArticlePage, {
  title: `${article.title} - Vladimir Eremin`,
  description: article.description,
});