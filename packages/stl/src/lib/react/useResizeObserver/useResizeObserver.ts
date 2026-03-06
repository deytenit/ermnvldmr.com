import { useEffect, useState } from 'react';

/** Result of useResizeObserver */
export interface UseResizeObserverResult {
  /** Observed width */
  width: number;
  /** Observed height */
  height: number;
}

/**
 * A hook that observes the size of an element and returns its dimensions.
 *
 * @param ref - A React ref to the element to observe.
 * @returns The dimensions of the observed element.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const { width, height } = useResizeObserver(ref);
 *
 *   return <div ref={ref}>Width: {width}, Height: {height}</div>;
 * };
 * ```
 */
export const useResizeObserver = <T extends HTMLElement>(
  ref: React.RefObject<T | null>
): UseResizeObserverResult => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observeTarget = ref.current;
    if (!observeTarget) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || !entries.length) {
        return;
      }
      const entry = entries[0];
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    resizeObserver.observe(observeTarget);

    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);

  return dimensions;
};
