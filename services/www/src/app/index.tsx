import { HomePage } from './HomePage';
import { createPage } from '../lib/createPage';
import { SITE_DESCRIPTION, SITE_TITLE } from '../shared/constants';

createPage(HomePage, { title: SITE_TITLE, description: SITE_DESCRIPTION });