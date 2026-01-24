import { mergeConfig } from 'vite';
import type { StorybookConfig } from '@storybook/react-vite';

export const baseStorybookConfig: Partial<StorybookConfig> = {
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-coverage',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  viteFinal: async (config) => {
    try {
      const tailwindcss = (await import('@tailwindcss/vite')).default;
      const istanbul = (await import('vite-plugin-istanbul')).default;
      
      return mergeConfig(config, {
        plugins: [
          tailwindcss(),
          istanbul({
            include: 'src/**/*',
            exclude: ['node_modules', 'test/', '**/*.stories.tsx', '**/*.test.tsx'],
            extension: ['.js', '.jsx', '.ts', '.tsx'],
            requireEnv: false,
            cypress: false,
            forceBuildInstrument: true,
          }),
        ],
      });
    } catch (error) {
      // Fallback if plugins can't be loaded
      console.warn('Failed to load Storybook plugins:', error);
      return config;
    }
  },
};
