// @ts-check
import path from 'node:path';
import { defineBaseConfig, i18nConfig } from './config/index.js';
import { i18nPlugin } from './plugins/i18n.js';

// Resolve the monorepo root relative to this library's location
const rootDir = path.resolve(import.meta.dirname, '../../../../');

/**
 * Default base configuration for the monorepo.
 */
export const baseConfig = defineBaseConfig(rootDir);

export { defineBaseConfig, i18nConfig, i18nPlugin };
