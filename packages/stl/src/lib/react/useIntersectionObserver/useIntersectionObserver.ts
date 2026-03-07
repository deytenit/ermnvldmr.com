import { useEffect, useState } from 'react';

/** Options for useIntersectionObserver */
export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Whether to disconnect after the first intersection */
  once?: boolean;
}

/**
 * A hook that observes if an element is intersecting with its root.
 *
 * @param ref - A React ref to the element to observe.
 * @param options - IntersectionObserver configuration.
 * @returns Boolean indicating if the element is currently intersecting.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const isVisible = useIntersectionObserver(ref);
 *
 *   return <div ref={ref}>{isVisible ? 'I am visible!' : 'Scroll down...'}</div>;
 * };
 * ```
 */
export const useIntersectionObserver = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { once = true, ...options }: UseIntersectionObserverOptions = {}
): boolean => {
  const [isIntersecting, setIntersecting] = useState(false);
  const { root, rootMargin, threshold } = options;

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIntersecting(true);
      return;
    }

    const observeTarget = ref.current;
    if (!observeTarget) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && once) {
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(observeTarget);

    return () => {
      observer.disconnect();
    };
  }, [ref, once, root, rootMargin, threshold]);

  return isIntersecting;
};
