// @ts-check
import { javascriptConfig } from './javascript.js';
import { getTypescriptConfig } from './typescript.js';
import { importsConfig } from './imports.js';
import { jsdocConfig } from './jsdoc.js';
import { testingConfig } from './testing.js';
import { toolingConfig } from './tooling.js';
import { defineMonorepoRestrictedImports } from './monorepo.js';

/**
 * Common ignores for the entire monorepo.
 */
const ignoresConfig = {
  ignores: [
    '**/dist',
    '**/node_modules',
    '**/.github',
    '**/.changeset',
    '**/coverage',
    '.config/**/*',
    '*.config.{js,ts,mjs,cjs}',
    '!.storybook', // Allow linting of .storybook directory
  ],
};

/**
 * Assemble the base ESLint configuration.
 *
 * @param {string} rootDir - The root directory of the project using this config.
 * @returns {import('eslint').Linter.Config[]} The assembled configuration.
 */
export function defineBaseConfig(rootDir) {
  return [
    ignoresConfig,
    ...javascriptConfig,
    ...getTypescriptConfig(rootDir),
    ...importsConfig,
    ...jsdocConfig,
    ...testingConfig,
    ...toolingConfig,
    ...defineMonorepoRestrictedImports(rootDir),
  ];
}
