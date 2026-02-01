import { render } from '@testing-library/react';

import type { RenderOptions, RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';

/**
 * Custom render function that sets up any required providers
 * @param ui - React component to render
 * @param options - Render options excluding wrapper
 * @returns RenderResult from testing library
 * @example
 * ```tsx
 * render(<Button>Click me</Button>);
 * ```
 */
function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult {
  return render(ui, {
    // Add any providers here if needed in the future
    ...options,
  });
}

// Re-export everything from testing library
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';

// Override render method
export { customRender as render };
