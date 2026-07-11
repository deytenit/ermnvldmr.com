import { config } from '@dotenvx/dotenvx';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

let loaded = false;

/**
 * Walks up the directory tree from `start` until it finds a directory
 * containing `pnpm-workspace.yaml` (the monorepo root), or reaches the
 * filesystem root.
 *
 * @param start - Directory to begin the search from.
 * @returns The path of the monorepo root directory, or `start` as a fallback.
 *
 * @internal
 */
function findRoot(start: string): string {
  let dir = start;
  while (true) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml'))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      // Reached the filesystem root without finding the marker.
      return start;
    }
    dir = parent;
  }
}

/**
 * Ensures dotenvx has loaded `.env.dev` from the monorepo root into `process.env`.
 * Walks up from the current working directory to find the root, then loads the
 * `.env.dev` file located there. Safe to call multiple times — runs only once per
 * process.
 *
 * @internal
 */
function ensureLoaded(): void {
  if (!loaded) {
    config({ path: join(findRoot(process.cwd()), '.env.dev') });
    loaded = true;
  }
}

/**
 * Reads an environment variable by key, loading `.env.dev` files via dotenvx on
 * the first call. Optionally returns a fallback value when the variable is
 * not set.
 *
 * Designed for use inside `cli.ts` config files so that env values are
 * resolved **at command execution time** (after dotenvx has populated
 * `process.env`), not at config-parse time.
 *
 * @param key - The name of the environment variable to read.
 * @param fallback - Optional fallback value returned when the variable is absent.
 * @returns The environment variable value, the fallback, or `undefined`.
 *
 * @example
 * ```typescript
 * import { env } from '@ermnvldmr/cli';
 *
 * s3SyncCommand({
 *   bucket: env('MY_BUCKET'),
 *   region: env('AWS_REGION', 'us-east-1'),
 * });
 * ```
 */
export function env(key: string, fallback?: string): string | undefined {
  ensureLoaded();
  return process.env[key] ?? fallback;
}
