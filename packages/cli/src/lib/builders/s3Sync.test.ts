import { describe, it, expect } from 'vitest';

import { s3SyncCommand } from './s3Sync.js';

describe('s3SyncCommand', () => {
  it('should create an s3-sync command config', () => {
    const config = s3SyncCommand({
      name: 'sync',
      description: 'Sync files',
      targetPrefix: 'www'
    });

    expect(config.type).toBe('s3-sync');
    expect(config.name).toBe('sync');
    expect(config.targetPrefix).toBe('www');
  });
});
