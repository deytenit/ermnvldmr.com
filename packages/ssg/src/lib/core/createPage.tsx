import React from 'react';

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
 * Internal interface representing a component with attached page options.
 */
interface HasPageOptions {
  /** The attached page options. */
  __pageOptions?: PageOptions;
}

/**
 * Type predicate checking if a value is an object or function with attached page options.
 *
 * @param value - The value to inspect.
 * @returns True if value has __pageOptions.
 * @example
 * ```ts
 * if (hasPageOptions(Component)) {
 *   console.log(Component.__pageOptions);
 * }
 * ```
 */
function hasPageOptions(value: unknown): value is HasPageOptions {
  return (
    (typeof value === 'function' || (typeof value === 'object' && value !== null)) &&
    '__pageOptions' in value
  );
}

/**
 * Retrieves the page metadata options attached to a component via createPage.
 *
 * @param component - The component to inspect.
 * @returns The associated PageOptions, or undefined if none are set.
 * @example
 * ```ts
 * const options = getPageOptions(MyPageComponent);
 * ```
 */
export function getPageOptions(component: unknown): PageOptions | undefined {
  if (hasPageOptions(component)) {
    return component.__pageOptions;
  }
  return undefined;
}

/**
 * Mounts or hydrates a React component into the `#root` element.
 *
 * Attaches metadata options for SSG extraction. Skips DOM mounting during the SSG
 * server-side render pass (`typeof window === 'undefined'`). On the client, hydrates
 * asynchronously during idle time to unblock First Contentful Paint.
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
  Object.assign(Component, { __pageOptions: options });

  if (typeof window === 'undefined') return; // SSG build context: skip DOM mounting
  const rootElement = document.getElementById('root');

  if (options.title && document.title !== options.title) {
    document.title = options.title;
  }

  if (options.description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    if (metaDescription.getAttribute('content') !== options.description) {
      metaDescription.setAttribute('content', options.description);
    }
  }

  if (!rootElement) return;

  const mountOrHydrate = () => {
    void import('react-dom/client')
      .then(({ createRoot, hydrateRoot }) => {
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
      })
      .catch((err: unknown) => {
        console.error('[createPage] Client hydration failed:', err);
      });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(mountOrHydrate);
  } else {
    setTimeout(mountOrHydrate, 1);
  }
}
