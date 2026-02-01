import { createLibConfig } from '@ermnvldmr/vite-config/lib';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

const baseConfig = createLibConfig('ErmnvldmrUI', 'src/index.ts', ['@ermnvldmr/stl'], {
  dts: {
    exclude: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.stories.tsx',
      'src/setupTests.ts',
      'src/test-utils.tsx',
    ],
  },
});

export default mergeConfig(baseConfig, {
  plugins: [tailwindcss()],
});
