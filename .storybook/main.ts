import path from 'path';

import { mergeConfig } from 'vite';

import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
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
  viteFinal: async (config) => {
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
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          '@shadcn': path.resolve(__dirname, '../src/shadcn'),
        },
      },
    });
  },
};

export default config;
