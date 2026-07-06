import { Command } from 'commander';
import { describe, it, expect, vi } from 'vitest';

import { registerCommands } from './runner.js';
import { runS3Sync } from './runners/s3SyncRunner.js';

vi.mock('./runners/s3SyncRunner.js', () => ({
  runS3Sync: vi.fn(),
}));

describe('registerCommands', () => {
  it('registers commands into a Commander instance', () => {
    const program = new Command();
    const actionSpy = vi.fn();
    
    registerCommands(program, {
      commands: [
        {
          type: 'node',
          name: 'test-cmd',
          description: 'A test command',
          action: actionSpy,
        }
      ]
    });
    
    // We simulate parsing args to run the action
    program.parse(['node', 'script', 'test-cmd']);
    expect(actionSpy).toHaveBeenCalled();
  });

  it('registers s3-sync commands into a Commander instance', async () => {
    const program = new Command();
    const cmd = {
      type: 's3-sync' as const,
      name: 'sync-cmd',
      description: 'An S3 sync command',
      targetPrefix: 'my-site',
    };
    
    registerCommands(program, {
      commands: [cmd]
    });
    
    await program.parseAsync(['node', 'script', 'sync-cmd']);
    expect(runS3Sync).toHaveBeenCalledWith(cmd, expect.any(Object));
  });
});
