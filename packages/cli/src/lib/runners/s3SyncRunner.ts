import fs from 'fs';
import path from 'path';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { execaCommand } from 'execa';
import fg from 'fast-glob';
import mime from 'mime-types';

import type { S3SyncCommandConfig, ProcessedFile } from '../types.js';

/**
 * Normalizes prefix and name to construct a clean S3 key.
 *
 * @param prefix - The target directory prefix.
 * @param name - The relative path/name of the file.
 * @returns The clean, normalized S3 key.
 *
 * @example
 * ```typescript
 * normalizeKey('static', 'js/main.js'); // 'static/js/main.js'
 * ```
 */
function normalizeKey(prefix: string, name: string): string {
  const parts = [prefix, name]
    .filter(Boolean)
    .map(p => p.replace(/^\/+|\/+$/g, '').replace(/\\/g, '/'));
  return parts.join('/');
}

/**
 * Runs the S3 Sync command.
 *
 * Loads environment variables, instantiates S3Client, processes files,
 * replaces static asset references in source files (`/static/filename` -> S3 URL),
 * and uploads the assets to S3.
 *
 * @param cmd - The configuration for the S3 sync command.
 * @param options - Additional options passed from Commander.
 * @returns A promise that resolves when the synchronization is complete.
 * @throws An error if required environment variables are missing.
 *
 * @example
 * ```typescript
 * await runS3Sync(cmd, {});
 * ```
 */
export async function runS3Sync(
  cmd: S3SyncCommandConfig,
  options: Record<string, unknown> = {}
): Promise<void> {
  void options;

  const bucket = cmd.bucket ?? process.env.S3_BUCKET;
  const region = cmd.region ?? process.env.AWS_REGION ?? process.env.S3_REGION;
  const endpoint = cmd.endpoint ?? process.env.S3_ENDPOINT_URL ?? process.env.S3_ENDPOINT;
  const accessKey = cmd.accessKeyId ?? process.env.AWS_ACCESS_KEY_ID ?? process.env.S3_ACCESS_KEY_ID;
  const secretKey = cmd.secretAccessKey ?? process.env.AWS_SECRET_ACCESS_KEY ?? process.env.S3_SECRET_ACCESS_KEY;

  if (!bucket || !region || !accessKey || !secretKey) {
    throw new Error('Missing required S3 environment variables');
  }

  const s3Client = new S3Client({
    region,
    ...(endpoint ? { endpoint } : {}),
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    forcePathStyle: true,
  });

  if (cmd.hooks?.beforeSync) {
    const hook = cmd.hooks.beforeSync;
    if (typeof hook === 'string') {
      console.log(`Running beforeSync script: ${hook}`);
      await execaCommand(hook, { stdio: 'inherit', shell: true });
    } else {
      console.log('Running beforeSync hook...');
      await hook();
    }
  }

  const sourceDir = cmd.sourceDir ?? './public/static';
  const resolvedSourceDir = path.resolve(process.cwd(), sourceDir);

  if (!fs.existsSync(resolvedSourceDir)) {
    throw new Error(`Source directory does not exist: ${resolvedSourceDir}`);
  }

  // Find all files in the source directory, including dotfiles
  const rawFiles = await fg('**/*', {
    cwd: resolvedSourceDir,
    onlyFiles: true,
    absolute: true,
    dot: true,
  });

  // Process files through the hook if it exists, otherwise use the default mapping with auto-optimization detection
  let processedFiles: ProcessedFile[];
  if (cmd.hooks?.beforeUpload) {
    const rawProcessed = await cmd.hooks.beforeUpload(rawFiles);
    processedFiles = rawProcessed.map((file) => ({
      ...file,
      originalName: file.originalName.replace(/\\/g, '/'),
      finalName: file.finalName.replace(/\\/g, '/'),
    }));
  } else {
    // Index raw files by normalized relative path
    const rawRels = new Set(
      rawFiles.map((file) => path.relative(resolvedSourceDir, file).replace(/\\/g, '/'))
    );

    processedFiles = rawFiles.map((file) => {
      const rel = path.relative(resolvedSourceDir, file).replace(/\\/g, '/');
      const ext = path.extname(file).toLowerCase();

      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const webpRel = rel.slice(0, -ext.length) + '.webp';
        if (rawRels.has(webpRel)) {
          // An optimized WebP version exists in the directory!
          // Map original reference to the WebP final upload path
          return {
            originalName: rel,
            finalName: webpRel,
            absolutePath: path.resolve(resolvedSourceDir, webpRel),
          };
        }
      }

      return {
        originalName: rel,
        finalName: rel,
        absolutePath: file,
      };
    });
  }

  /**
   * Helper to construct the S3 URL for a final filename.
   *
   * @param finalName - The final processed name of the file.
   * @returns The public URL of the file on S3.
   *
   * @example
   * ```typescript
   * getS3Url('js/main.js'); // 'https://my-bucket.s3.us-east-1.amazonaws.com/my-prefix/js/main.js'
   * ```
   */
  const getS3Url = (finalName: string): string => {
    const normalizedKey = normalizeKey(cmd.targetPrefix, finalName);
    if (endpoint) {
      const cleanEndpoint = endpoint.replace(/\/+$/, '');
      return `${cleanEndpoint}/${bucket}/${normalizedKey}`;
    }
    return `https://${bucket}.s3.${region}.amazonaws.com/${normalizedKey}`;
  };

  // Find workspace source files matching `src/**/*.{ts,tsx,css,md,mdx}`
  const sourceFiles = await fg('src/**/*.{ts,tsx,css,md,mdx}', {
    cwd: process.cwd(),
    absolute: true,
  });

  // Sort assets by length descending to handle overlapping name replacement correctly
  const sortedAssets = [...processedFiles].sort(
    (a, b) => b.originalName.length - a.originalName.length
  );

  // Replace static asset references in workspace source files
  for (const sourceFile of sourceFiles) {
    let content = await fs.promises.readFile(sourceFile, 'utf-8');
    if (!content.includes('/static/')) {
      continue;
    }
    let modified = false;

    for (const asset of sortedAssets) {
      let searchName = asset.originalName;
      if (searchName.startsWith('static/')) {
        searchName = searchName.substring('static/'.length);
      } else if (searchName.startsWith('/static/')) {
        searchName = searchName.substring('/static/'.length);
      }
      const searchStr = `/static/${searchName}`;
      const assetUrl = getS3Url(asset.finalName);

      if (content.includes(searchStr)) {
        content = content.split(searchStr).join(assetUrl);
        modified = true;
      }
    }

    if (modified) {
      await fs.promises.writeFile(sourceFile, content, 'utf-8');
    }
  }

  // Deduplicate files for S3 upload by their S3 key (finalName)
  const uniqueUploads = Array.from(
    new Map(processedFiles.map((file) => [file.finalName, file])).values()
  );

  // Upload files to S3
  console.log(`Syncing ${uniqueUploads.length} unique files to s3://${bucket}/${cmd.targetPrefix}...`);
  for (const file of uniqueUploads) {
    const s3Key = normalizeKey(cmd.targetPrefix, file.finalName);
    const contentType = mime.lookup(file.absolutePath) || 'application/octet-stream';
    const fileContent = await fs.promises.readFile(file.absolutePath);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: s3Key,
        Body: fileContent,
        ContentType: contentType,
      })
    );
  }
}
