import { renderHook } from '@testing-library/react';
import React from 'react';

import { useResizeObserver } from './useResizeObserver';

describe('useResizeObserver', () => {
  it('should return initial dimensions', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { result } = renderHook(() => useResizeObserver(ref));
    expect(result.current).toEqual({ width: 0, height: 0 });
  });

  // Testing the actual resize observation is tricky in JSDOM.
  // A more complete test would require a full browser environment.
});
