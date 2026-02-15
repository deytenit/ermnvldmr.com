import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../static/global.css';

/**
 * Options for page creation
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
 *
 * @example
 * ```tsx
 * createPage(App, { title: 'My Page' });
 * ```
 */
export function createPage(Component: React.ComponentType, options: PageOptions = {}): void {
  const rootElement = document.getElementById('root');

  if (options.title) {
    document.title = options.title;
  }

  if (rootElement) {
    createRoot(rootElement).render(
      <React.StrictMode>
        <Component />
      </React.StrictMode>
    );
  }
}
