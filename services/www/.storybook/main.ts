import path from 'path';
import type { StorybookConfig } from 'storybook-react-rsbuild';

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
    name: 'storybook-react-rsbuild',
    options: {},
  },
  rsbuildFinal: (config) => {
    config.resolve ||= {};
    config.resolve.alias = {
        ...config.resolve.alias,
        '#': path.resolve(__dirname, '../src'),
        '@ermnvldmr/stl': path.resolve(__dirname, '../../../packages/stl/src'),
        '@ermnvldmr/ui': path.resolve(__dirname, '../../../packages/ui/src'),
    };
    return config;
  },
};

export default config;
