import { pluginBabel } from '@rsbuild/plugin-babel';
import { resolve } from 'path';
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
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  rsbuildFinal: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ermnvldmr/stl': resolve(__dirname, '../../stl/src'),
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