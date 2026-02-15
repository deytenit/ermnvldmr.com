import path from 'path';
import { pluginBabel } from '@rsbuild/plugin-babel';
import type { StorybookConfig } from 'storybook-react-rsbuild';

const config: StorybookConfig = {
  stories: ['../../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
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

    // Add Babel plugin with istanbul for coverage
    config.plugins = config.plugins || [];
    config.plugins.push(
      pluginBabel({
        include: /\.(?:jsx|tsx)$/,
        exclude: /[\\/]node_modules[\\/]/,
        babelLoaderOptions: (opts) => {
          opts.plugins = opts.plugins || [];
          opts.plugins.push([
            'babel-plugin-istanbul',
            {
              exclude: ['**/*.stories.tsx', '**/*.test.tsx', 'node_modules/**'],
              extension: ['.js', '.jsx', '.ts', '.tsx'],
            },
          ]);
        },
      })
    );

    return config;
  },
};

export default config;
