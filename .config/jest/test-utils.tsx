import { render, type RenderOptions } from '@testing-library/react';

import type { ReactElement } from 'react';

/**
 * Custom render function with default providers and configurations
 * @param ui - React element to render
 * @param options - Additional render options
 * @returns Render result from testing library
 * 
 * @example
 * ```typescript
 * import { render, screen } from '.config/jest/test-utils';
 * import { MyComponent } from './MyComponent';
 * 
 * render(<MyComponent />);
 * expect(screen.getByText('Hello')).toBeInTheDocument();
 * ```
 */
const customRender = (ui: ReactElement, options?: RenderOptions) => {
  return render(ui, {
    // Add any providers here if needed (e.g., ThemeProvider, Router, etc.)
    ...options,
  });
};

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };
