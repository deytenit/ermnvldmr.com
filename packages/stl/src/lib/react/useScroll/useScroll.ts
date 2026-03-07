import { useState, useEffect, useRef } from 'react';

/** Result of useScroll */
export interface UseScrollResult {
  /** x scroll position */
  x: number;
  /** y scroll position */
  y: number;
}

/**
 * A hook to track window scroll position.
 *
 * @returns An object containing the x and y scroll position.
 *
 * @example
 * ```tsx
 * const { x, y } = useScroll();
 * ```
 */
export const useScroll = (): UseScrollResult => {
  const [scroll, setScroll] = useState(() => ({
    x: typeof window !== 'undefined' ? window.scrollX : 0,
    y: typeof window !== 'undefined' ? window.scrollY : 0,
  }));
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setScroll({ x: window.scrollX, y: window.scrollY });
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scroll;
};
