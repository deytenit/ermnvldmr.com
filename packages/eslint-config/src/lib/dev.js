// @ts-check
import path from 'node:path';
import { defineBaseConfig } from './config/index.js';

// Resolve the monorepo root relative to this library's location
const rootDir = path.resolve(import.meta.dirname, '../../../../');

/**
 * Default base configuration for the monorepo.
 */
export const baseConfig = defineBaseConfig(rootDir);

export { defineBaseConfig };
