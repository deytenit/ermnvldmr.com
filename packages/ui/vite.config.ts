import { createLibConfig } from '@ermnvldmr/vite-config/lib';

export default createLibConfig('ErmnvldmrUI', 'src/index.ts', ['@ermnvldmr/stl'], {
  dts: {
    exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx', 'src/setupTests.ts', 'src/test-utils.tsx'],
  },
});
