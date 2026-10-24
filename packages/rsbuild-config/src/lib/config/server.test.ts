import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  ensureDevCertificates,
  ensureHostsEntry,
  findWorkspaceRoot,
  hasHostsEntry,
  localDevServer,
} from './server.js';

describe('server dev configuration', () => {
  it('locates the workspace root with pnpm-workspace.yaml', () => {
    const root = findWorkspaceRoot();
    expect(existsSync(`${root}/pnpm-workspace.yaml`)).toBe(true);
  });

  it('ensures dev certificates exist and returns existing paths', () => {
    const certs = ensureDevCertificates();
    expect(existsSync(certs.certPath)).toBe(true);
    expect(existsSync(certs.keyPath)).toBe(true);
    expect(certs.certPath).toContain('.certs/localhost.ermnvldmr.com.pem');
  });

  it('returns production configuration without https when NODE_ENV is production', () => {
    const prevEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'production';
      const config = localDevServer({ port: 3000 });
      expect(config.port).toBe(3000);
      expect(config.https).toBeUndefined();
    } finally {
      process.env.NODE_ENV = prevEnv;
    }
  });

  it('configures dev server with https and formatted urls for localhost.ermnvldmr.com', () => {
    const prevEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'development';
      const config = localDevServer({ port: 3000 });
      expect(config.host).toBe('0.0.0.0');
      expect(config.port).toBe(3000);
      expect(config.cors).toBe(true);
      expect(config.https).toBeDefined();

      if (typeof config.printUrls === 'function') {
        const urls = config.printUrls({
          protocol: 'https',
          port: 3000,
          urls: [],
          routes: [],
        });
        expect(urls).toEqual(['https://localhost.ermnvldmr.com:3000']);
      }
    } finally {
      process.env.NODE_ENV = prevEnv;
    }
  });

  it('detects entries correctly in hosts file', () => {
    const mockHostsPath = join(tmpdir(), `hosts-test-${Date.now()}`);
    try {
      writeFileSync(mockHostsPath, '127.0.0.1 localhost\n# 127.0.0.1 localhost.ermnvldmr.com\n');
      expect(hasHostsEntry('localhost.ermnvldmr.com', mockHostsPath)).toBe(false);

      writeFileSync(
        mockHostsPath,
        '127.0.0.1 localhost\n127.0.0.1 localhost.ermnvldmr.com other.domain\n'
      );
      expect(hasHostsEntry('localhost.ermnvldmr.com', mockHostsPath)).toBe(true);
    } finally {
      if (existsSync(mockHostsPath)) unlinkSync(mockHostsPath);
    }
  });

  it('appends missing entry to writable hosts file', () => {
    const mockHostsPath = join(tmpdir(), `hosts-test-${Date.now()}`);
    try {
      writeFileSync(mockHostsPath, '127.0.0.1 localhost\n');
      const added = ensureHostsEntry('localhost.ermnvldmr.com', '127.0.0.1', mockHostsPath);
      expect(added).toBe(true);

      const content = readFileSync(mockHostsPath, 'utf8');
      expect(content).toContain('127.0.0.1 localhost.ermnvldmr.com');
      expect(hasHostsEntry('localhost.ermnvldmr.com', mockHostsPath)).toBe(true);
    } finally {
      if (existsSync(mockHostsPath)) unlinkSync(mockHostsPath);
    }
  });

  it('rejects invalid domain or ip in ensureHostsEntry', () => {
    expect(ensureHostsEntry('invalid domain with spaces', '127.0.0.1')).toBe(false);
    expect(ensureHostsEntry('localhost.ermnvldmr.com', 'invalid-ip-format')).toBe(false);
  });
});
