import React from 'react';

import { genericMemo } from './genericMemo';

describe('react/genericMemo', () => {
  it('should memoize a component', () => {
    const Component = ({ name }: { name: string }) => <div>{name}</div>;
    const Memoized = genericMemo(Component);
    
    expect(Memoized).toBeDefined();
    // In React, memo returns a special object with type: component
    expect((Memoized as any).type).toBe(Component);
  });
});
