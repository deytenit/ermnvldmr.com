import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

/**
 * Options for page creation.
 */
export interface PageOptions {
  /** Document title to set on mount. */
  title?: string;
  /** Content of the meta description tag. */
  description?: string;
}

/**
 * Mounts or hydrates a React component into the `#root` element.
 *
 * Skips DOM mounting during the SSG server-side render pass
 * (`typeof window === 'undefined'`). On the client, hydrates if the
 * root already has children (SSG output), otherwise performs a fresh
 * `createRoot` render.
 *
 * @param Component - The React component to render.
 * @param options - Optional page metadata (title, description).
 *
 * @example
 * ```tsx
 * createPage(App, { title: 'My Page' });
 * ```
 */
export function createPage(Component: React.ComponentType, options: PageOptions = {}): void {
  if (typeof window === 'undefined') return; // SSG build context: skip DOM mounting
  const rootElement = document.getElementById('root');

  if (options.title) {
    document.title = options.title;
  }

  if (options.description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', options.description);
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
