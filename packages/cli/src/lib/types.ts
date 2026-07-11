/**
 * Base configuration interface for all CLI commands.
 */
export interface BaseCommandConfig {
  /** The name of the command */
  name: string;
  /** A brief description of what the command does */
  description: string;
  /** Optional array of command-line options/flags */
  options?: {
    /** The flag definitions, e.g., '-f, --force' */
    flags: string;
    /** Description of the option */
    description: string;
    /** The default value if the option is not provided */
    defaultValue?: string | boolean | string[];
  }[];
}

/**
 * Configuration for a Bash script based command.
 */
export interface BashCommandConfig extends BaseCommandConfig {
  /** The bash script or command to execute */
  script: string;
  /** The type discriminator for bash commands */
  type: 'bash';
}

/**
 * Configuration for a Node.js function based command.
 */
export interface NodeCommandConfig extends BaseCommandConfig {
  /** The action function to execute when the command is run */
  action: (options: Record<string, unknown>) => Promise<void> | void;
  /** The type discriminator for node commands */
  type: 'node';
}

/**
 * Represents a processed file ready for upload.
 */
export interface ProcessedFile {
  /** The original name of the file before processing */
  originalName: string;
  /** The final name of the file after processing, used as S3 key */
  finalName: string;
  /** The absolute path of the file on the local filesystem */
  absolutePath: string;
}

/**
 * A hook value that can be either a shell command string or an async JS function.
 *
 * - **`string`** — executed as a shell command via the system shell.
 * - **`() => Promise<void>`** — called directly, useful for programmatic pre-processing.
 */
export type HookValue = string | (() => Promise<void>);

/**
 * Lifecycle hooks for the S3 sync command.
 */
export interface S3SyncHooks {
  /**
   * Runs before the sync process starts (before files are discovered).
   *
   * Accepts either a shell command string or an async function.
   *
   * @example
   * ```typescript
   * // Shell command
   * hooks: { beforeSync: 'bash ./scripts/optimize-images.sh' }
   *
   * // JS function
   * hooks: { beforeSync: async () => { await optimizeImages(); } }
   * ```
   */
  beforeSync?: HookValue;

  /**
   * Runs after files are discovered but before they are uploaded.
   *
   * Receives the raw list of absolute file paths and must return the processed
   * file descriptors to upload. Useful for filtering, renaming, or replacing
   * files (e.g., swapping `.png` originals for their `.webp` counterparts).
   *
   * @param files - Absolute paths of all discovered files.
   * @returns The processed file list to upload.
   *
   * @example
   * ```typescript
   * hooks: {
   *   beforeUpload: async (files) =>
   *     files.map((f) => ({ originalName: path.basename(f), finalName: path.basename(f), absolutePath: f }))
   * }
   * ```
   */
  beforeUpload?: (files: string[]) => Promise<ProcessedFile[]>;
}

/**
 * Configuration for an S3 synchronization command.
 */
export interface S3SyncCommandConfig extends BaseCommandConfig {
  /** The type discriminator for S3 sync commands */
  type: 's3-sync';
  /** The source directory containing files to sync */
  sourceDir?: string;
  /** The prefix (directory) under which to upload the files in the S3 bucket */
  targetPrefix: string;
  /** Optional S3 bucket name */
  bucket?: string;
  /** Optional AWS region */
  region?: string;
  /** Optional custom endpoint URL (e.g., for MinIO or Yandex Cloud) */
  endpoint?: string;
  /** Optional AWS Access Key ID */
  accessKeyId?: string;
  /** Optional AWS Secret Access Key */
  secretAccessKey?: string;
  /** Hooks to modify the sync process at various lifecycle stages */
  hooks?: S3SyncHooks;
}

/**
 * Union type representing any valid CLI command configuration.
 */
export type CliCommand = BashCommandConfig | NodeCommandConfig | S3SyncCommandConfig;

/**
 * Root configuration object for the CLI toolkit.
 */
export interface CliConfig {
  /** Array of registered commands */
  commands: CliCommand[];
}
