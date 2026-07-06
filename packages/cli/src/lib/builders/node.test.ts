import { describe, it, expect } from 'vitest';

import { nodeCommand } from './node.js';

describe('nodeCommand builder', () => {
  it('should return a properly formatted node command config', () => {
    const action = async () => {};
    const config = nodeCommand({
      name: 'build',
      description: 'builds stuff',
      action,
    });

    expect(config.name).toBe('build');
    expect(config.description).toBe('builds stuff');
    expect(config.action).toBe(action);
    expect(config.type).toBe('node');
  });
});
