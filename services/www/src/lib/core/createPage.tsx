import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '../../static/global.css'; // Ensure global styles are available

/**
 *
 */
export interface PageOptions {
  title?: string;
  description?: string;
}

/**
 * Creates a React page component with hydration support.
 *
 * @param Component - The React component to render.
 * @param options - Page options like title.
 * @returns The page component.
 *
 * @example
 * ```tsx
 * createPage(<App />);
 * ```
 */
export function createPage(Component: React.ComponentType, options: PageOptions = {}): void {
  const rootElement = document.getElementById('root');

  if (options.title) {
    document.title = options.title;
  }

  if (rootElement) {
    const node = (
      <React.StrictMode>
        <Component />
      </React.StrictMode>
    );

    if (rootElement.hasChildNodes()) {
      hydrateRoot(rootElement, node);
    } else {
      createRoot(rootElement).render(node);
    }
  }
}
