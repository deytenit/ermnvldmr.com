import json
import base64
import io
import zipfile
import os
import re
import subprocess
import urllib.request

SERVER = 'https://git.ermnvldmr.com'
REPO = 'deytenit/ermnvldmr.com'
IMAGE = SERVER.removeprefix('https://') + '/' + REPO + '/www'


def validate_input(sha, digest, run_id):
    if not re.fullmatch(r'[0-9a-f]{40}', sha):
        raise ValueError('Full source SHA required')
    if not re.fullmatch(r'sha256:[0-9a-f]{64}', digest):
        raise ValueError('OCI sha256 digest required')
    if not re.fullmatch(r'[1-9][0-9]*', run_id):
        raise ValueError('Numeric build run ID required')


def validate_run(run, sha):
    expected = {'head_sha': sha, 'head_branch': 'next', 'status': 'completed', 'conclusion': 'success'}
    if any(run.get(key) != value for key, value in expected.items()):
        raise ValueError('Build did not succeed for this next commit')
    if run.get('repository', {}).get('full_name') != REPO or (run.get('head_repository') and run['head_repository'].get('full_name') != REPO):
        raise ValueError('Build source repository mismatch')
    if run.get('path') != 'services-www-next-required.yml@refs/heads/next':
        raise ValueError('Wrong build workflow')
    if run.get('event') not in ('push', 'workflow_dispatch'):
        raise ValueError('Untrusted build event')


def api(path):
    req = urllib.request.Request(SERVER + '/api/v1/repos/' + REPO + path, headers={'Authorization': 'token ' + os.environ['PROVENANCE_TOKEN']})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)


def validate_labels(labels, sha, run_id):
    if labels.get('org.opencontainers.image.revision') != sha or labels.get('com.ermnvldmr.ci.run') != run_id:
        raise ValueError('Immutable image provenance mismatch')


def validate_manifest(manifest, sha, digest, run_id):
    expected = {'sha': sha, 'digest': digest, 'run_id': run_id, 'repository': REPO}
    if manifest != expected:
        raise ValueError('Build artifact does not attest requested image digest')


def artifact_manifest(run_id, name='www-provenance', filename='www-provenance.json'):
    artifacts = api('/actions/runs/' + run_id + '/artifacts')['artifacts']
    matching = [a for a in artifacts if a.get('name') == name and not a.get('expired', True)]
    if len(matching) != 1:
        raise ValueError('Exactly one unexpired build provenance artifact required')
    class SameHostRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            if not newurl.startswith(SERVER + '/'):
                raise ValueError('Unexpected artifact storage host')
            return super().redirect_request(req, fp, code, msg, headers, newurl)
    request = urllib.request.Request(SERVER + '/api/v1/repos/' + REPO + '/actions/artifacts/' + str(matching[0]['id']) + '/zip', headers={'Authorization': 'token ' + os.environ['PROVENANCE_TOKEN']})
    with urllib.request.build_opener(SameHostRedirect).open(request, timeout=30) as response:
        payload = response.read(1024 * 1024 + 1)
    if len(payload) > 1024 * 1024:
        raise ValueError('Unexpected provenance artifact size')
    with zipfile.ZipFile(io.BytesIO(payload)) as archive:
        members = [name for name in archive.namelist() if name.rsplit('/', 1)[-1] == filename]
        if len(members) != 1:
            raise ValueError('Missing or ambiguous provenance manifest')
        if archive.getinfo(members[0]).file_size > 65536:
            raise ValueError('Unexpected provenance document size')
        return json.loads(archive.read(members[0]))


def main():
    sha, digest, run_id = os.environ['TESTED_SHA'], os.environ['TESTED_DIGEST'], os.environ['BUILD_RUN_ID']
    validate_input(sha, digest, run_id)
    current = api('/actions/runs/' + os.environ['GITHUB_RUN_ID'])
    if current.get('event') != 'workflow_dispatch' or current.get('head_branch') != 'next':
        raise ValueError('Approval must be manually dispatched on protected next')
    actor = current.get('trigger_actor') or current.get('actor') or {}
    if actor.get('login') != 'deytenit':
        raise ValueError('Only the repository owner may approve promotion')
    if not api('/branches/next').get('protected'):
        raise ValueError('The next branch must be protected before promotion')
    validate_run(api('/actions/runs/' + run_id), sha)
    validate_manifest(artifact_manifest(run_id), sha, digest, run_id)
    if os.environ.get('RELEASE_RUN_ID'):
        release_id = os.environ['RELEASE_RUN_ID']
        if not re.fullmatch(r'[1-9][0-9]*', release_id):
            raise ValueError('Numeric release run ID required')
        release = api('/actions/runs/' + release_id)
        actor = release.get('trigger_actor') or release.get('actor') or {}
        if release.get('conclusion') != 'success' or release.get('status') != 'completed' or release.get('event') != 'workflow_dispatch' or release.get('head_branch') != 'next' or release.get('path') != 'services-www-release-manual.yml@refs/heads/next' or actor.get('login') != 'deytenit':
            raise ValueError('Successful independently approved release required')
        manifest = artifact_manifest(release_id, 'www-release-provenance', 'www-release.json')
        expected = {'sha': sha, 'digest': digest, 'run_id': run_id, 'repository': REPO, 'release_tag': os.environ['RELEASE_TAG']}
        if manifest != expected:
            raise ValueError('Release approval does not match requested artifact')
    auth = base64.b64encode(('deytenit:' + os.environ['PROVENANCE_TOKEN']).encode()).decode()
    subprocess.run(['git', '-c', 'http.https://git.ermnvldmr.com/.extraheader=AUTHORIZATION: basic ' + auth, 'fetch', 'origin', 'next'], check=True)
    subprocess.run(['git', 'merge-base', '--is-ancestor', sha, 'origin/next'], check=True)
    subprocess.run(['docker', 'pull', IMAGE + '@' + digest], check=True)
    data = json.loads(subprocess.check_output(['docker', 'image', 'inspect', IMAGE + '@' + digest], text=True))
    validate_labels(data[0]['Config'].get('Labels') or {}, sha, run_id)
    with open(os.environ['GITHUB_OUTPUT'], 'a') as stream:
        stream.write('short_sha=sha-' + sha[:7] + '\n')


if __name__ == '__main__':
    main()
