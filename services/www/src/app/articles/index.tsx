import { ArticlesList } from './ArticlesList';
import { createPage } from '../../lib/createPage';
import { SITE_TITLE } from '../../shared/constants';

createPage(ArticlesList, {
  title: `Articles | ${SITE_TITLE}`,
  description: 'Browse all articles and projects.',
});