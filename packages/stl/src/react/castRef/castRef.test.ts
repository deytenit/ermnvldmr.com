import { castRef } from './castRef';

import type React from 'react';

describe('react/castRef', () => {
  it('should cast a ref to a different type', () => {
    const ref = { current: null } as unknown as React.ForwardedRef<HTMLDivElement>;
    const casted = castRef<HTMLSpanElement>(ref);
    expect(casted).toBe(ref);
  });
});
