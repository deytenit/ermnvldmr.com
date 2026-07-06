import { describe, it, expect } from 'vitest';

import { bashCommand } from './bash.js';

describe('bashCommand builder', () => {
  it('should return a properly formatted bash command config', () => {
    const config = bashCommand({
      name: 'hello',
      description: 'says hello',
      script: 'echo "hello"',
    });

    expect(config.name).toBe('hello');
    expect(config.description).toBe('says hello');
    expect(config.script).toBe('echo "hello"');
    expect(config.type).toBe('bash');
  });
});
