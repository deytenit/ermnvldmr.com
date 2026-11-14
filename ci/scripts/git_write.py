import os
import re
import shlex
import subprocess
import sys
import tempfile
from pathlib import Path


def main():
    ref=sys.argv[1]
    if ref not in ('HEAD:next','trunk') and not re.fullmatch(r'refs/tags/[A-Za-z0-9][A-Za-z0-9._-]*(/[A-Za-z0-9][A-Za-z0-9._-]*)*',ref):
        raise ValueError('Unexpected publication ref')
    repository=os.environ['GITHUB_REPOSITORY']
    if not re.fullmatch(r'deytenit/[A-Za-z0-9_.-]+',repository):
        raise ValueError('Unexpected repository owner')
    with tempfile.TemporaryDirectory(prefix='gitea-write-key-') as directory:
        raw_key = os.environ['GIT_WRITE_KEY'].replace('\r\n', '\n').rstrip('\n')
        if not raw_key:
            raise ValueError('GIT_WRITE_KEY is empty')
        key = Path(directory) / 'key'
        key.write_text(raw_key + '\n')
        key.chmod(0o600)
        repo_root = Path(__file__).resolve().parents[2]
        candidates = [
            repo_root / '.gitea' / 'known_hosts',
            repo_root / 'ci' / 'known_hosts',
            Path(__file__).resolve().parent.parent / '.gitea' / 'known_hosts',
            Path(__file__).resolve().parent.parent / 'known_hosts',
        ]
        known = next((c for c in candidates if c.exists()), None)
        if not known:
            raise FileNotFoundError(f'Could not find known_hosts in {[str(c) for c in candidates]}')
        env = dict(os.environ)
        env.pop('GIT_WRITE_KEY', None)
        env['GIT_SSH_COMMAND'] = shlex.join([
            'ssh', '-T', '-i', str(key),
            '-o', 'BatchMode=yes',
            '-o', 'ConnectTimeout=15',
            '-o', 'HostName=45.150.33.239',
            '-o', 'IdentitiesOnly=yes',
            '-o', 'StrictHostKeyChecking=yes',
            '-o', 'HostKeyAlgorithms=ssh-ed25519',
            '-o', f'UserKnownHostsFile={known}',
        ])
        subprocess.run(['git', 'push', f'ssh://git@git.ermnvldmr.com:22222/{repository}.git', ref], env=env, check=True)


if __name__=='__main__':main()
