import fs from 'fs';
import path from 'path';

import { Command } from 'commander';
import { execaCommand } from 'execa';
import { createJiti } from 'jiti';

import type { CliConfig } from './types.js';

/**
 * Registers commands from the configuration into a Commander program.
 * 
 * @param program - The Commander program instance.
 * @param config - The CLI configuration containing the commands to register.
 * @example
 * ```typescript
 * import { Command } from 'commander';
 * const program = new Command();
 * registerCommands(program, { commands: [] });
 * ```
 */
export function registerCommands(program: Command, config: CliConfig): void {
  for (const cmd of config.commands) {
    const command = program.command(cmd.name).description(cmd.description);
    
    if (cmd.options) {
      for (const opt of cmd.options) {
        command.option(opt.flags, opt.description, opt.defaultValue);
      }
    }

    switch (cmd.type) {
      case 'bash': {
        command.action(async () => {
          try {
            await execaCommand(cmd.script, { stdio: 'inherit', shell: true });
          } catch (err: unknown) {
            const isErrorWithExitCode = (e: unknown): e is { exitCode: number } => {
              return typeof e === 'object' && e !== null && 'exitCode' in e && typeof Reflect.get(e, 'exitCode') === 'number';
            };
            process.exit(isErrorWithExitCode(err) ? err.exitCode : 1);
          }
        });
        break;
      }
      case 'node': {
        command.action(async (options: Record<string, unknown>) => {
          try {
            await cmd.action(options);
          } catch (err: unknown) {
            console.error(err);
            process.exit(1);
          }
        });
        break;
      }
      case 's3-sync': {
        command.action(async (options: Record<string, unknown>) => {
          try {
            const { runS3Sync } = await import('./runners/s3SyncRunner.js');
            await runS3Sync(cmd, options);
          } catch (err: unknown) {
            console.error(err);
            process.exit(1);
          }
        });
        break;
      }
      default: {
        const _exhaustiveCheck: never = cmd;
        void _exhaustiveCheck;
        break;
      }
    }
  }
}

/**
 * Main entry point function that loads the CLI configuration and executes the runner.
 * 
 * @param cwd - Current working directory (defaults to process.cwd()).
 * @param argv - Process arguments (defaults to process.argv).
 * @example
 * ```typescript
 * await runCli();
 * ```
 */
export async function runCli(cwd: string = process.cwd(), argv: string[] = process.argv): Promise<void> {
  const configPath = path.join(cwd, '.config/cli.ts');
  
  if (!fs.existsSync(configPath)) {
    console.error(`Error: No .config/cli.ts found in ${cwd}`);
    process.exit(1);
  }

  const jiti = createJiti(import.meta.url);
  const rawModule = await jiti.import(configPath);
  
  const isCliConfigModule = (mod: unknown): mod is { default: CliConfig } => {
    return typeof mod === 'object' && mod !== null && 'default' in mod;
  };

  if (!isCliConfigModule(rawModule)) {
    console.error(`Error: Invalid CLI configuration export in ${configPath}`);
    process.exit(1);
  }

  const config = rawModule.default;

  const program = new Command();
  program
    .name('ermnvldmr-cli')
    .description('Extensible CLI runner')
    .version('1.0.0');

  registerCommands(program, config);
  
  program.parse(argv);
}
