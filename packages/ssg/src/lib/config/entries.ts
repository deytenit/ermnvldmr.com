import { join } from 'node:path';

import fg from 'fast-glob';

/**
 * Discovers page entry files matching a glob pattern and maps them to Rsbuild entry names.
 *
 * Entry names follow the file path relative to `src/app/`, with the `.tsx` extension
 * stripped. For example, `./src/app/articles/index.tsx` becomes `articles/index`,
 * which Rsbuild maps to `dist/articles/index.html`.
 *
 * @param root - Absolute path to the service root directory (use `import.meta.dirname`).
 * @param pattern - Glob pattern relative to `root`, e.g. `'./src/app/**\/*.tsx'`.
 * @returns A record of entry name to absolute file path suitable for `source.entry`.
 *
 * @example
 * ```typescript
 * source: {
 *   entry: discoverEntries(import.meta.dirname, './src/app/**\/*.tsx'),
 * }
 * ```
 */
export function discoverEntries(root: string, pattern: string): Record<string, string> {
  const files = fg.sync(pattern, { cwd: root });
  const entries: Record<string, string> = {};

  for (const file of files) {
    const parts = file.split('/');
    const filename = parts[parts.length - 1].replace(/\.tsx$/, '');
    const appMatch = /src\/app\/(.*)\.tsx$/.exec(file);
    const name = appMatch ? appMatch[1] : filename;
    entries[name] = join(root, file);
  }

  return entries;
}
