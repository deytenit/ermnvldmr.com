// @ts-check
import fs from 'node:fs';
import path from 'node:path';

/** @type {import('eslint').Linter.Config[] | null} */
let cachedRules = null;

/**
 * Dynamically generates restricted import rules for monorepo packages
 * to ensure they use relative imports for internal code.
 *
 * @param {string} rootDir - The root directory of the monorepo.
 * @returns {import('eslint').Linter.Config[]} An array of ESLint configurations.
 */
export function defineMonorepoRestrictedImports(rootDir) {
  if (cachedRules) return cachedRules;

  const workspaces = ['packages', 'services'];
  const configs = [];

  for (const workspace of workspaces) {
    const workspacePath = path.join(rootDir, workspace);
    if (!fs.existsSync(workspacePath)) continue;

    const entries = fs.readdirSync(workspacePath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const pkgPath = path.join(workspacePath, entry.name);
      const pkgJsonPath = path.join(pkgPath, 'package.json');

      if (fs.existsSync(pkgJsonPath)) {
        try {
          const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
          const pkgName = pkgJson.name;
          // Use relative path from root to package for 'files' pattern
          const relativePkgPath = path.relative(rootDir, pkgPath);

          configs.push({
            files: [`${relativePkgPath}/**/*`],
            rules: {
              'no-restricted-imports': [
                'error',
                {
                  paths: [
                    {
                      name: pkgName,
                      message: `Please use relative imports within the package instead of "${pkgName}".`,
                    },
                  ],
                  patterns: [
                    {
                      group: [`${pkgName}/*`],
                      message: `Please use relative imports within the package instead of "${pkgName}/*".`,
                    },
                  ],
                },
              ],
            },
          });
        } catch (e) {
          // Skip packages that can't be parsed
        }
      }
    }
  }

  cachedRules = configs;
  return configs;
}
