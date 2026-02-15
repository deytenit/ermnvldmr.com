import type { RsbuildPlugin } from '@rsbuild/core';

/**
 * A minimal Rsbuild plugin for build-time Static Site Generation.
 * Placeholder for future extension.
 */
export function ssgPlugin(): RsbuildPlugin {
  return {
    name: 'ermnvldmr:ssg-plugin',
    setup(api) {
      api.onAfterBuild(async ({ stats }) => {
        if (!stats) return;
        console.log('[ssg-plugin] Build finished.');
      });
    },
  };
}
