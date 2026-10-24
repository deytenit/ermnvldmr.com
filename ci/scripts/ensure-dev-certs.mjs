import { execSync } from 'node:child_process';
import { appendFileSync, chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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
      if (tokens.length >= 2 && tokens.slice(1).includes(domain)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

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

  const isInteractive = Boolean(process.stdin && process.stdin.isTTY && process.stdout && process.stdout.isTTY);
  if (isInteractive) {
    try {
      console.log(`[hosts] Adding "${entry}" to ${hostsPath} (requires sudo)...`);
      execSync(`sudo sh -c 'printf "\\n${entry}\\n" >> "${hostsPath}"'`, {
        stdio: 'inherit',
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
 * Ensures valid development certificates exist for localhost.ermnvldmr.com.
 *
 * @param {string} workspaceRoot - Absolute path to workspace root
 * @returns {{ certPath: string, keyPath: string }} Paths to cert and key
 */
export function ensureDevCertificates(workspaceRoot = findWorkspaceRoot()) {
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
    execSync('mkcert -help', { stdio: 'ignore' });
    hasMkcertCli = true;
  } catch {
    hasMkcertCli = false;
  }

  if (hasMkcertCli) {
    execSync(
      `mkcert -cert-file "${certPath}" -key-file "${keyPath}" localhost.ermnvldmr.com "*.localhost.ermnvldmr.com" localhost 127.0.0.1 ::1`,
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
      execSync(
        `openssl req -new -nodes -newkey rsa:2048 -keyout "${keyPath}" -out "${tempCsr}" -subj "/CN=localhost.ermnvldmr.com" -batch`,
        { stdio: 'pipe' }
      );
      execSync(
        `openssl x509 -req -in "${tempCsr}" -CA "${hugoCaCert}" -CAkey "${hugoCaKey}" -CAcreateserial -out "${certPath}" -days 825 -extfile "${tempExt}"`,
        { stdio: 'pipe' }
      );
      chmodSync(keyPath, 0o600);
      chmodSync(certPath, 0o644);
    } finally {
      if (existsSync(tempCsr)) execSync(`rm -f "${tempCsr}"`);
      if (existsSync(tempExt)) execSync(`rm -f "${tempExt}"`);
    }
    return { certPath, keyPath };
  }

  const caDir = join(home, '.local/share/mkcert');
  mkdirSync(caDir, { recursive: true });
  execSync(
    `openssl req -x509 -nodes -newkey rsa:3072 -keyout "${hugoCaKey}" -out "${hugoCaCert}" -days 3650 -subj "/CN=mkcert development CA/O=mkcert development CA" -batch`,
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
    execSync(
      `openssl req -new -nodes -newkey rsa:2048 -keyout "${keyPath}" -out "${tempCsr}" -subj "/CN=localhost.ermnvldmr.com" -batch`,
      { stdio: 'pipe' }
    );
    execSync(
      `openssl x509 -req -in "${tempCsr}" -CA "${hugoCaCert}" -CAkey "${hugoCaKey}" -CAcreateserial -out "${certPath}" -days 825 -extfile "${tempExt}"`,
      { stdio: 'pipe' }
    );
    chmodSync(keyPath, 0o600);
    chmodSync(certPath, 0o644);
  } finally {
    if (existsSync(tempCsr)) execSync(`rm -f "${tempCsr}"`);
    if (existsSync(tempExt)) execSync(`rm -f "${tempExt}"`);
  }

  return { certPath, keyPath };
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('ensure-dev-certs.mjs')) {
  const { certPath, keyPath } = ensureDevCertificates();
  console.log(`[certs] Ready:\n  Cert: ${certPath}\n  Key:  ${keyPath}`);
}
