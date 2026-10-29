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
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

/**
 * Checks whether a hostname entry exists in the specified hosts file.
 *
 * @param {string} domain - Domain to search for
 * @param {string} hostsPath - Path to hosts file
 * @returns {boolean} Whether domain is present
 */
export function hasHostsEntry(domain = 'localhost.ermnvldmr.com', hostsPath = '/etc/hosts') {
  if (!existsSync(hostsPath)) return false;
  try {
    const content = readFileSync(hostsPath, 'utf8');
    const lines = content.split('\n');
    for (const line of lines) {
      const uncommented = (line.split('#')[0] || '').trim();
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
 * Ensures a mapping for the domain exists in /etc/hosts.
 *
 * @param {string} domain - Domain to map
 * @param {string} ip - Target IP address
 * @param {string} hostsPath - Path to hosts file
 * @returns {boolean} Whether entry is present
 */
export function ensureHostsEntry(
  domain = 'localhost.ermnvldmr.com',
  ip = '127.0.0.1',
  hostsPath = '/etc/hosts'
) {
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

  const isInteractive = Boolean(
    process.stdin && process.stdin.isTTY && process.stdout && process.stdout.isTTY
  );
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
 * Traverses upwards to find the monorepo root containing pnpm-workspace.yaml.
 *
 * @param {string} startDir - Directory to start searching from
 * @returns {string} Absolute path to workspace root
 */
export function findWorkspaceRoot(startDir = dirname(fileURLToPath(import.meta.url))) {
  let current = startDir;
  while (current !== dirname(current)) {
    if (existsSync(join(current, 'pnpm-workspace.yaml'))) {
      return current;
    }
    current = dirname(current);
  }
  return process.cwd();
}

/**
 * Resolves the development Root CA private key from the environment or .env.dev.
 *
 * @param {string} workspaceRoot - Absolute path to workspace root
 * @returns {string | undefined} The PEM private key string, or undefined if unavailable
 */
export function loadDevRootCaKey(workspaceRoot = findWorkspaceRoot()) {
  if (process.env.COM_ERMNVLDMR_DEV_ROOT_CA_KEY) {
    const raw = process.env.COM_ERMNVLDMR_DEV_ROOT_CA_KEY;
    return raw.includes('\\n') ? raw.replace(/\\n/g, '\n') : raw;
  }

  const envDevPath = join(workspaceRoot, '.env.dev');
  const envKeysPath = join(workspaceRoot, '.env.keys');

  if (!existsSync(envDevPath)) {
    return undefined;
  }

  const candidatePackages = [
    join(workspaceRoot, 'packages/cli/package.json'),
    join(workspaceRoot, 'package.json'),
  ];

  for (const pkgPath of candidatePackages) {
    if (!existsSync(pkgPath)) continue;
    try {
      const req = createRequire(pkgPath);
      const dotenvx = req('@dotenvx/dotenvx');
      if (dotenvx && typeof dotenvx.config === 'function') {
        dotenvx.config({ path: envDevPath, envKeysFile: envKeysPath });
        const key = process.env.COM_ERMNVLDMR_DEV_ROOT_CA_KEY;
        if (key) {
          return key.includes('\\n') ? key.replace(/\\n/g, '\n') : key;
        }
      }
    } catch {
      // Continue to next candidate package
    }
  }

  return undefined;
}

/**
 * Remote public URL for the Ermnvldmr development root CA certificate.
 */
export const REMOTE_ROOT_CA_URL =
  'https://static.ermnvldmr.com/dev/ssl/certs/ErmnvldmrDevelopmentRootCA.pem';

/**
 * Ensures valid development certificates exist for localhost.ermnvldmr.com.
 *
 * @param {string} workspaceRoot - Absolute path to workspace root
 * @returns {{ certPath: string, keyPath: string }} Paths to cert and key
 */
export function ensureDevCertificates(workspaceRoot = findWorkspaceRoot()) {
  const certsDir = join(workspaceRoot, '.certs');
  const certPath = join(certsDir, 'localhost.ermnvldmr.com.pem');
  const keyPath = join(certsDir, 'localhost.ermnvldmr.com-key.pem');
  const caCertPath = join(certsDir, 'ErmnvldmrDevelopmentRootCA.pem');
  const caKeyPath = join(certsDir, 'ErmnvldmrDevelopmentRootCA-key.pem');

  ensureHostsEntry('localhost.ermnvldmr.com', '127.0.0.1');

  const home = homedir();
  const globalCaDir = join(home, '.local/share/mkcert');
  const globalCaCert = join(globalCaDir, 'ErmnvldmrDevelopmentRootCA.pem');
  const globalCaKey = join(globalCaDir, 'ErmnvldmrDevelopmentRootCA-key.pem');

  mkdirSync(certsDir, { recursive: true, mode: 0o700 });

  // 1. Sync CA cert from global cache if available, or download from remote static URL
  if (!existsSync(caCertPath)) {
    if (existsSync(globalCaCert)) {
      writeFileSync(caCertPath, readFileSync(globalCaCert));
      chmodSync(caCertPath, 0o644);
    } else {
      try {
        execFileSync('curl', ['-sSfL', REMOTE_ROOT_CA_URL, '-o', caCertPath], {
          stdio: 'ignore',
        });
        chmodSync(caCertPath, 0o644);
        try {
          mkdirSync(globalCaDir, { recursive: true });
          writeFileSync(globalCaCert, readFileSync(caCertPath));
          chmodSync(globalCaCert, 0o644);
        } catch {
          // Best-effort global cache
        }
      } catch {
        // Failed to download, will fall back to generation if key also needed
      }
    }
  }

  // 2. Sync CA key from global cache if available, or decrypt from .env.dev
  if (!existsSync(caKeyPath)) {
    if (existsSync(globalCaKey)) {
      writeFileSync(caKeyPath, readFileSync(globalCaKey));
      chmodSync(caKeyPath, 0o600);
    } else {
      const decryptedKey = loadDevRootCaKey(workspaceRoot);
      if (decryptedKey) {
        writeFileSync(caKeyPath, decryptedKey);
        chmodSync(caKeyPath, 0o600);
        try {
          mkdirSync(globalCaDir, { recursive: true });
          writeFileSync(globalCaKey, decryptedKey);
          chmodSync(globalCaKey, 0o600);
        } catch {
          // Best-effort global cache
        }
      }
    }
  }

  // If server cert and CA cert already exist, return them
  if (existsSync(certPath) && existsSync(keyPath) && existsSync(caCertPath)) {
    return { certPath, keyPath, caCertPath };
  }

  // Ensure ErmnvldmrDevelopmentRootCA exists
  if (!existsSync(caCertPath) || !existsSync(caKeyPath)) {
    mkdirSync(globalCaDir, { recursive: true });
    execFileSync(
      'openssl',
      [
        'req',
        '-x509',
        '-nodes',
        '-newkey',
        'rsa:3072',
        '-keyout',
        caKeyPath,
        '-out',
        caCertPath,
        '-days',
        '3650',
        '-subj',
        '/CN=Ermnvldmr Development Root CA/O=ermnvldmr.com',
        '-batch',
      ],
      { stdio: 'pipe' }
    );
    chmodSync(caKeyPath, 0o600);
    chmodSync(caCertPath, 0o644);

    writeFileSync(globalCaCert, readFileSync(caCertPath));
    writeFileSync(globalCaKey, readFileSync(caKeyPath));
    chmodSync(globalCaKey, 0o600);
    chmodSync(globalCaCert, 0o644);
  }

  // Generate server certificate signed by ErmnvldmrDevelopmentRootCA
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
        caCertPath,
        '-CAkey',
        caKeyPath,
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

  return { certPath, keyPath, caCertPath };
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('ensure-dev-certs.mjs')) {
  const { certPath, keyPath } = ensureDevCertificates();
  console.log(`[certs] Ready:\n  Cert: ${certPath}\n  Key:  ${keyPath}`);
}
