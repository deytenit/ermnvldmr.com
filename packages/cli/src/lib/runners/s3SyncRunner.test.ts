import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { runS3Sync } from './s3SyncRunner.js';

import type { S3SyncCommandConfig } from '../types.js';

interface MockPutObjectCommandInput {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
}

class MockPutObjectCommand {
  constructor(public input: MockPutObjectCommandInput) {}
}

// Mock dotenvx
vi.mock('@dotenvx/dotenvx', () => ({
  config: vi.fn(),
}));

// Mock S3Client
const mockSend = vi.fn<(command: MockPutObjectCommand) => Promise<unknown>>();
vi.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: class {
      send = mockSend;
    },
    PutObjectCommand: class {
      constructor(public input: MockPutObjectCommandInput) {}
    },
  };
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('runS3Sync', () => {
  const tempDir = path.resolve(__dirname, 'temp_test_s3_sync');
  let cwdSpy: { mockRestore: () => void };

  beforeEach(() => {
    mockSend.mockReset();
    
    // Set required environment variables
    process.env.S3_BUCKET = 'my-bucket';
    process.env.AWS_REGION = 'us-east-1';
    process.env.S3_ENDPOINT_URL = 'https://s3.example.com';
    process.env.AWS_ACCESS_KEY_ID = 'access-key';
    process.env.AWS_SECRET_ACCESS_KEY = 'secret-key';

    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });

    // Mock process.cwd to return tempDir so glob search happens in tempDir/src
    cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(tempDir);
  });

  afterEach(() => {
    cwdSpy.mockRestore();
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('should throw error if required env variables are missing', async () => {
    const cmd: S3SyncCommandConfig = {
      name: 'sync',
      description: 'desc',
      targetPrefix: 'test',
      type: 's3-sync'
    };
    
    // Clear env vars
    delete process.env.S3_BUCKET;
    
    await expect(runS3Sync(cmd, {})).rejects.toThrow('Missing required S3 environment variables');
  });

  it('should successfully sync files using default sourceDir and replace references in source files', async () => {
    // Default sourceDir is public/static
    const publicStaticDir = path.join(tempDir, 'public/static');
    fs.mkdirSync(publicStaticDir, { recursive: true });

    // Create dummy source folder and files (where references will be replaced)
    const srcDir = path.join(tempDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    
    const htmlSourcePath = path.join(srcDir, 'index.tsx');
    const cssSourcePath = path.join(srcDir, 'style.css');

    fs.writeFileSync(htmlSourcePath, 'const img = "/static/logo.png";');
    fs.writeFileSync(cssSourcePath, 'body { background: url(/static/logo.png); }');

    // Create dummy files inside the static directory to upload
    const imagePath = path.join(publicStaticDir, 'logo.png');
    fs.writeFileSync(imagePath, 'binary-content-mock');

    const cmd: S3SyncCommandConfig = {
      name: 'sync',
      description: 'desc',
      targetPrefix: 'my-site',
      type: 's3-sync',
    };

    // Run sync (which should default to public/static)
    await runS3Sync(cmd, {});

    // Check if the HTML and CSS source file references were replaced
    const htmlContent = fs.readFileSync(htmlSourcePath, 'utf-8');
    const cssContent = fs.readFileSync(cssSourcePath, 'utf-8');

    expect(htmlContent).toContain('https://s3.example.com/my-bucket/my-site/logo.png');
    expect(cssContent).toContain('https://s3.example.com/my-bucket/my-site/logo.png');

    // Check if S3Client sent PutObjectCommands for the file
    expect(mockSend).toHaveBeenCalledTimes(1);

    const calls = mockSend.mock.calls;
    const commandInstance = calls[0][0];
    expect(commandInstance.input.Key).toBe('my-site/logo.png');
  });

  it('should replace longer overlapping filenames before shorter ones', async () => {
    const publicStaticDir = path.join(tempDir, 'public/static');
    fs.mkdirSync(publicStaticDir, { recursive: true });

    const srcDir = path.join(tempDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    
    const sourcePath = path.join(srcDir, 'index.tsx');
    fs.writeFileSync(sourcePath, 'const img1 = "/static/logo.png.webp"; const img2 = "/static/logo.png";');

    fs.writeFileSync(path.join(publicStaticDir, 'logo.png.webp'), 'webp-mock');
    fs.writeFileSync(path.join(publicStaticDir, 'logo.png'), 'png-mock');

    const cmd: S3SyncCommandConfig = {
      name: 'sync',
      description: 'desc',
      targetPrefix: 'my-site',
      type: 's3-sync',
    };

    await runS3Sync(cmd, {});

    const content = fs.readFileSync(sourcePath, 'utf-8');
    expect(content).toContain('https://s3.example.com/my-bucket/my-site/logo.png.webp');
    expect(content).toContain('https://s3.example.com/my-bucket/my-site/logo.png');
    expect(content).not.toContain('/static/logo.png.webp');
    expect(content).not.toContain('/static/logo.png');
  });

  it('should respect beforeUpload hook if provided', async () => {
    const publicStaticDir = path.join(tempDir, 'public/static');
    fs.mkdirSync(publicStaticDir, { recursive: true });

    const htmlPath = path.join(publicStaticDir, 'index.html');
    fs.writeFileSync(htmlPath, '<html><body>Hello</body></html>');

    const cmd: S3SyncCommandConfig = {
      name: 'sync',
      description: 'desc',
      targetPrefix: 'my-site',
      type: 's3-sync',
      hooks: {
        beforeUpload: (files) => {
          const processed = files.map(file => {
            const ext = path.extname(file);
            const base = path.basename(file, ext);
            return {
              originalName: path.basename(file),
              finalName: `custom-${base}${ext}`,
              absolutePath: file,
            };
          });
          return Promise.resolve(processed);
        }
      }
    };

    await runS3Sync(cmd, {});

    expect(mockSend).toHaveBeenCalledTimes(1);
    const commandInstance = mockSend.mock.calls[0][0];
    expect(commandInstance.input.Key).toBe('my-site/custom-index.html');
  });

  it('should resolve S3 configuration parameters passed directly via configuration object', async () => {
    const publicStaticDir = path.join(tempDir, 'public/static');
    fs.mkdirSync(publicStaticDir, { recursive: true });

    // Write a dummy file to upload so the upload loop runs
    fs.writeFileSync(path.join(publicStaticDir, 'test.txt'), 'content');

    // Clear standard env vars to ensure fallback is not used
    delete process.env.S3_BUCKET;
    delete process.env.AWS_REGION;
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;

    const cmd: S3SyncCommandConfig = {
      name: 'sync',
      description: 'desc',
      targetPrefix: 'test',
      bucket: 'direct-bucket',
      region: 'us-west-2',
      accessKeyId: 'direct-access-key',
      secretAccessKey: 'direct-secret-key',
      type: 's3-sync'
    };

    await runS3Sync(cmd, {});

    expect(mockSend).toHaveBeenCalled();
    const commandInstance = mockSend.mock.calls[0][0];
    expect(commandInstance.input.Bucket).toBe('direct-bucket');
  });

  it('should run beforeSync hook as shell command if provided as string', async () => {
    const publicStaticDir = path.join(tempDir, 'public/static');
    fs.mkdirSync(publicStaticDir, { recursive: true });
    fs.writeFileSync(path.join(publicStaticDir, 'test.txt'), 'content');

    const cmd: S3SyncCommandConfig = {
      name: 'sync',
      description: 'desc',
      targetPrefix: 'test',
      type: 's3-sync',
      hooks: {
        beforeSync: 'echo "hello from beforeSync script"',
      },
    };

    await runS3Sync(cmd, {});
    expect(mockSend).toHaveBeenCalled();
  });

  it('should run beforeSync hook as async function if provided as function', async () => {
    const publicStaticDir = path.join(tempDir, 'public/static');
    fs.mkdirSync(publicStaticDir, { recursive: true });
    fs.writeFileSync(path.join(publicStaticDir, 'test.txt'), 'content');

    const beforeSyncFn = vi.fn().mockResolvedValue(undefined);

    const cmd: S3SyncCommandConfig = {
      name: 'sync',
      description: 'desc',
      targetPrefix: 'test',
      type: 's3-sync',
      hooks: {
        beforeSync: beforeSyncFn,
      },
    };

    await runS3Sync(cmd, {});
    expect(beforeSyncFn).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalled();
  });

  it('should automatically map png/jpg/jpeg to webp if counterpart exists and deduplicate uploads', async () => {
    const publicStaticDir = path.join(tempDir, 'public/static');
    fs.mkdirSync(publicStaticDir, { recursive: true });

    // Create png and webp counterpart
    fs.writeFileSync(path.join(publicStaticDir, 'logo.png'), 'png-content');
    fs.writeFileSync(path.join(publicStaticDir, 'logo.webp'), 'webp-content');

    // Create a source file referencing the png
    const srcDir = path.join(tempDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    const sourcePath = path.join(srcDir, 'index.tsx');
    fs.writeFileSync(sourcePath, 'const img = "/static/logo.png";');

    const cmd: S3SyncCommandConfig = {
      name: 'sync',
      description: 'desc',
      targetPrefix: 'test',
      type: 's3-sync',
    };

    await runS3Sync(cmd, {});

    // Reference replacement check: /static/logo.png should be replaced by S3 URL of logo.webp
    const content = fs.readFileSync(sourcePath, 'utf-8');
    expect(content).toContain('https://s3.example.com/my-bucket/test/logo.webp');
    expect(content).not.toContain('logo.png');

    // Deduplication check: only logo.webp should have been uploaded once (mockSend called once for logo.webp)
    expect(mockSend).toHaveBeenCalledTimes(1);
    const commandInstance = mockSend.mock.calls[0][0];
    expect(commandInstance.input.Key).toBe('test/logo.webp');
  });
});
