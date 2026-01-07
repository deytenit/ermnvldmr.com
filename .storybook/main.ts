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
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    const tailwindcss = (await import('@tailwindcss/vite')).default;
    return mergeConfig(config, {
      plugins: [tailwindcss()],
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
