import { describe, it, expect } from 'vitest';

import { defineCli, bashCommand, nodeCommand } from './index.js';

describe('public exports', () => {
  it('defineCli returns the passed config unmodified', () => {
    const config = defineCli({
      commands: [],
    });
    expect(config.commands).toEqual([]);
  });

  it('exports builders', () => {
    expect(typeof bashCommand).toBe('function');
    expect(typeof nodeCommand).toBe('function');
  });
});
