import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dotenvx before importing env
vi.mock('@dotenvx/dotenvx', () => ({
  config: vi.fn(),
}));

// Mock node:fs so findRoot returns a predictable root
vi.mock('node:fs', () => ({
  existsSync: vi.fn((p: string) => String(p).endsWith('pnpm-workspace.yaml')),
}));

describe('env', () => {
  beforeEach(() => {
    // Reset module registry so the `loaded` singleton resets between tests
    vi.resetModules();
  });

  it('calls dotenvx config() on first access with the root .env.dev path', async () => {
    const { config } = await import('@dotenvx/dotenvx');
    const { env } = await import('./env.js');

    process.env.TEST_VAR = 'hello';
    env('TEST_VAR');

    expect(config).toHaveBeenCalledTimes(1);
    const firstCall = vi.mocked(config).mock.calls[0];
    expect(firstCall[0]).toMatchObject({ path: expect.stringContaining('.env.dev') });
    delete process.env.TEST_VAR;
  });

  it('returns the environment variable value', async () => {
    const { env } = await import('./env.js');

    process.env.MY_KEY = 'my-value';
    expect(env('MY_KEY')).toBe('my-value');
    delete process.env.MY_KEY;
  });

  it('returns the fallback when the variable is not set', async () => {
    const { env } = await import('./env.js');

    delete process.env.MISSING_KEY;
    expect(env('MISSING_KEY', 'fallback-value')).toBe('fallback-value');
  });

  it('returns undefined when the variable is not set and no fallback is provided', async () => {
    const { env } = await import('./env.js');

    delete process.env.MISSING_KEY;
    expect(env('MISSING_KEY')).toBeUndefined();
  });

  it('calls dotenvx config() only once across multiple env() calls within the same import', async () => {
    const { config } = await import('@dotenvx/dotenvx');
    const mockConfig = vi.mocked(config);
    mockConfig.mockClear();

    const { env } = await import('./env.js');

    env('FOO');
    env('BAR');
    env('BAZ');

    // config() should have been called exactly once for this fresh module instance
    expect(mockConfig).toHaveBeenCalledTimes(1);
  });
});
