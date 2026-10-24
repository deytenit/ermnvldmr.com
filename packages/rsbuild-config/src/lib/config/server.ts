import { execFileSync } from 'node:child_process';
import {
  appendFileSync,
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import type { ServerConfig } from '@rsbuild/core';

/**
 * Configuration options for the local development server.
 */
export interface LocalDevServerOptions {
  /**
   * The port number on which the dev server should listen.
   */
  port: number;
  /**
   * Optional custom domain name. Defaults to 'localhost.ermnvldmr.com'.
   */
  host?: string;
}

/**
 * Certificate file paths resolved for local development.
 */
export interface DevCertificates {
  /**
   * Absolute path to the PEM certificate file.
   */
  certPath: string;
  /**
   * Absolute path to the PEM private key file.
   */
  keyPath: string;
}

/**
 * Checks whether a hostname entry exists in the specified hosts file.
 *
 * @param domain - Domain to search for, defaults to 'localhost.ermnvldmr.com'
 * @param hostsPath - Path to hosts file, defaults to '/etc/hosts'
 * @returns Whether the domain is mapped in the hosts file
 */
export function hasHostsEntry(
  domain: string = 'localhost.ermnvldmr.com',
  hostsPath: string = '/etc/hosts'
): boolean {
  if (!existsSync(hostsPath)) return false;
  try {
    const content = readFileSync(hostsPath, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const uncommented = line.split('#')[0]?.trim() ?? '';
      if (!uncommented) continue;
      const tokens = uncommented.split(/\s+/);
      const hostnames = tokens.slice(1);
      if (tokens.length >= 2 && hostnames.some((host) => host === domain)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

const DOMAIN_PATTERN = /^[a-zA-Z0-9.-]+$/;
const IP_PATTERN = /^[\da-fA-F.:]+$/;

/**
 * Ensures a mapping for the domain exists in the hosts file.
 *
 * If not present and the file is not directly writable, attempts to invoke sudo
 * when running in an interactive terminal.
 *
 * @param domain - Domain to map, defaults to 'localhost.ermnvldmr.com'
 * @param ip - Target IP address, defaults to '127.0.0.1'
 * @param hostsPath - Path to hosts file, defaults to '/etc/hosts'
 * @returns Whether the entry is now present in the hosts file
 */
export function ensureHostsEntry(
  domain: string = 'localhost.ermnvldmr.com',
  ip: string = '127.0.0.1',
  hostsPath: string = '/etc/hosts'
): boolean {
  if (!DOMAIN_PATTERN.test(domain) || !IP_PATTERN.test(ip)) {
    return false;
  }

  if (hasHostsEntry(domain, hostsPath)) {
    return true;
  }

  const entry = `${ip} ${domain}`;

  try {
    appendFileSync(hostsPath, `\n${entry}\n`);
    console.log(`[hosts] Added "${entry}" to ${hostsPath}`);
    return true;
  } catch {
    // Requires elevated permissions
  }

  const isInteractive = Boolean(process.stdin?.isTTY && process.stdout?.isTTY);
  if (isInteractive) {
    try {
      console.log(`[hosts] Adding "${entry}" to ${hostsPath} (requires sudo)...`);
      execFileSync('sudo', ['tee', '-a', hostsPath], {
        input: `\n${entry}\n`,
        stdio: ['pipe', 'ignore', 'inherit'],
      });
      console.log(`[hosts] Successfully added "${entry}" to ${hostsPath}`);
      return true;
    } catch {
      console.warn(`[hosts] Could not automatically update ${hostsPath}.`);
    }
  }

  console.warn(
    `[hosts] Notice: "${entry}" is missing from ${hostsPath}.\nPlease run:\n  sudo sh -c 'echo "${entry}" >> ${hostsPath}'`
  );
  return false;
}

/**
 * Traverses directory hierarchy upwards to locate the workspace root containing pnpm-workspace.yaml.
 *
 * @param startDir - Starting directory for lookup, defaults to current process directory
 * @returns Absolute path to the workspace root directory
 */
export function findWorkspaceRoot(startDir: string = process.cwd()): string {
  let current = startDir;
  while (current !== dirname(current)) {
    if (existsSync(join(current, 'pnpm-workspace.yaml'))) {
      return current;
    }
    current = dirname(current);
  }
  return startDir;
}

/**
 * Ensures that valid TLS development certificates exist for localhost.ermnvldmr.com.
 *
 * Checks for certificates in the workspace `.certs` directory. If absent, generates
 * new certificates signed by either an existing mkcert/Hugo root CA or an openssl-generated CA.
 *
 * @param workspaceRoot - Absolute path to workspace root
 * @returns Paths to the certificate and private key files
 */
export function ensureDevCertificates(
  workspaceRoot: string = findWorkspaceRoot()
): DevCertificates {
  const certsDir = join(workspaceRoot, '.certs');
  const certPath = join(certsDir, 'localhost.ermnvldmr.com.pem');
  const keyPath = join(certsDir, 'localhost.ermnvldmr.com-key.pem');

  ensureHostsEntry('localhost.ermnvldmr.com', '127.0.0.1');

  if (existsSync(certPath) && existsSync(keyPath)) {
    return { certPath, keyPath };
  }

  mkdirSync(certsDir, { recursive: true, mode: 0o700 });

  const home = homedir();
  const hugoCaCert = join(home, '.local/share/mkcert/rootCA.pem');
  const hugoCaKey = join(home, '.local/share/mkcert/rootCA-key.pem');

  let hasMkcertCli = false;
  try {
    execFileSync('mkcert', ['-help'], { stdio: 'ignore' });
    hasMkcertCli = true;
  } catch {
    hasMkcertCli = false;
  }

  if (hasMkcertCli) {
    execFileSync(
      'mkcert',
      [
        '-cert-file',
        certPath,
        '-key-file',
        keyPath,
        'localhost.ermnvldmr.com',
        '*.localhost.ermnvldmr.com',
        'localhost',
        '127.0.0.1',
        '::1',
      ],
      { stdio: 'inherit' }
    );
    chmodSync(keyPath, 0o600);
    return { certPath, keyPath };
  }

  if (existsSync(hugoCaCert) && existsSync(hugoCaKey)) {
    const tempDir = tmpdir();
    const tempCsr = join(tempDir, `ermnvldmr-dev-${Date.now()}.csr`);
    const tempExt = join(tempDir, `ermnvldmr-dev-${Date.now()}.cnf`);

    try {
      writeFileSync(
        tempExt,
        'subjectAltName=DNS:localhost.ermnvldmr.com,DNS:*.localhost.ermnvldmr.com,DNS:localhost,IP:127.0.0.1,IP:::1\n'
      );
      execFileSync(
        'openssl',
        [
          'req',
          '-new',
          '-nodes',
          '-newkey',
          'rsa:2048',
          '-keyout',
          keyPath,
          '-out',
          tempCsr,
          '-subj',
          '/CN=localhost.ermnvldmr.com',
          '-batch',
        ],
        { stdio: 'pipe' }
      );
      execFileSync(
        'openssl',
        [
          'x509',
          '-req',
          '-in',
          tempCsr,
          '-CA',
          hugoCaCert,
          '-CAkey',
          hugoCaKey,
          '-CAcreateserial',
          '-out',
          certPath,
          '-days',
          '825',
          '-extfile',
          tempExt,
        ],
        { stdio: 'pipe' }
      );
      chmodSync(keyPath, 0o600);
      chmodSync(certPath, 0o644);
    } finally {
      rmSync(tempCsr, { force: true });
      rmSync(tempExt, { force: true });
    }
    return { certPath, keyPath };
  }

  const caDir = join(home, '.local/share/mkcert');
  mkdirSync(caDir, { recursive: true });
  execFileSync(
    'openssl',
    [
      'req',
      '-x509',
      '-nodes',
      '-newkey',
      'rsa:3072',
      '-keyout',
      hugoCaKey,
      '-out',
      hugoCaCert,
      '-days',
      '3650',
      '-subj',
      '/CN=mkcert development CA/O=mkcert development CA',
      '-batch',
    ],
    { stdio: 'pipe' }
  );

  const tempDir = tmpdir();
  const tempCsr = join(tempDir, `ermnvldmr-dev-${Date.now()}.csr`);
  const tempExt = join(tempDir, `ermnvldmr-dev-${Date.now()}.cnf`);

  try {
    writeFileSync(
      tempExt,
      'subjectAltName=DNS:localhost.ermnvldmr.com,DNS:*.localhost.ermnvldmr.com,DNS:localhost,IP:127.0.0.1,IP:::1\n'
    );
    execFileSync(
      'openssl',
      [
        'req',
        '-new',
        '-nodes',
        '-newkey',
        'rsa:2048',
        '-keyout',
        keyPath,
        '-out',
        tempCsr,
        '-subj',
        '/CN=localhost.ermnvldmr.com',
        '-batch',
      ],
      { stdio: 'pipe' }
    );
    execFileSync(
      'openssl',
      [
        'x509',
        '-req',
        '-in',
        tempCsr,
        '-CA',
        hugoCaCert,
        '-CAkey',
        hugoCaKey,
        '-CAcreateserial',
        '-out',
        certPath,
        '-days',
        '825',
        '-extfile',
        tempExt,
      ],
      { stdio: 'pipe' }
    );
    chmodSync(keyPath, 0o600);
    chmodSync(certPath, 0o644);
  } finally {
    rmSync(tempCsr, { force: true });
    rmSync(tempExt, { force: true });
  }

  return { certPath, keyPath };
}

/**
 * Returns a dev server configuration preset with HTTPS and localhost.ermnvldmr.com domain formatting.
 *
 * @param options - Server configuration options (port, host)
 * @returns Rsbuild ServerConfig preset
 */
export function localDevServer(options: LocalDevServerOptions): ServerConfig {
  if (process.env.NODE_ENV === 'production') {
    return {
      port: options.port,
    };
  }

  const { certPath, keyPath } = ensureDevCertificates();
  const cert = readFileSync(certPath);
  const key = readFileSync(keyPath);
  const host = options.host ?? 'localhost.ermnvldmr.com';

  return {
    host: '0.0.0.0',
    port: options.port,
    cors: true,
    https: {
      key,
      cert,
    },
    printUrls: ({ protocol, port }: { protocol: string; port: number }) => {
      return [`${protocol}://${host}:${port}`];
    },
  };
}
