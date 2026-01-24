import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react';

/**
 * Base preview configuration for theme support.
 * 
 * @example
 * ```typescript
 * import { basePreviewConfig } from '@ermnvldmr/storybook-config/preview';
 * 
 * export default {
 *   ...basePreviewConfig,
 *   // additional overrides
 * };
 * ```
 */
export const basePreviewConfig: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0a0a0a',
        },
      ],
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};
