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
        raise ValueError(f'Full source SHA required: {sha}')
    if not re.fullmatch(r'sha256:[0-9a-f]{64}', digest):
        raise ValueError(f'OCI sha256 digest required: {digest}')
    if not re.fullmatch(r'[1-9][0-9]*', str(run_id)):
        raise ValueError(f'Numeric build run ID required: {run_id}')


def validate_run(run, sha):
    expected = {'head_sha': sha, 'head_branch': 'next', 'status': 'completed', 'conclusion': 'success'}
    if any(run.get(key) != value for key, value in expected.items()):
        raise ValueError('Build did not succeed for this next commit')
    if run.get('repository', {}).get('full_name') != REPO or (run.get('head_repository') and run['head_repository'].get('full_name') != REPO):
        raise ValueError('Build source repository mismatch')
    if run.get('path') != 'push-services-www-ci-build.yml@refs/heads/next':
        raise ValueError('Wrong build workflow')
    if run.get('event') not in ('push', 'workflow_dispatch'):
        raise ValueError('Untrusted build event')


def api(path):
    req = urllib.request.Request(SERVER + '/api/v1/repos/' + REPO + path, headers={'Authorization': 'token ' + os.environ['PROVENANCE_TOKEN']})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)


def validate_labels(labels, sha, run_id):
    if labels.get('org.opencontainers.image.revision') != sha or labels.get('com.ermnvldmr.ci.run') != str(run_id):
        raise ValueError('Immutable image provenance mismatch')


def validate_manifest(manifest, sha, digest, run_id):
    expected = {'sha': sha, 'digest': digest, 'run_id': str(run_id), 'repository': REPO}
    if any(str(manifest.get(k)) != str(v) for k, v in expected.items()):
        raise ValueError(f'Build artifact does not attest requested image digest: got {manifest}, expected {expected}')


def artifact_manifest(run_id, name='www-provenance', filename='www-provenance.json'):
    artifacts = api('/actions/runs/' + str(run_id) + '/artifacts')['artifacts']
    matching = [a for a in artifacts if a.get('name') == name and not a.get('expired', True)]
    if len(matching) != 1:
        raise ValueError(f'Exactly one unexpired build provenance artifact required for {name} on run {run_id}, found {len(matching)}')
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
    sha = os.environ.get('TESTED_SHA', '').strip()
    digest = os.environ.get('TESTED_DIGEST', '').strip()
    run_id = os.environ.get('BUILD_RUN_ID', '').strip()
    release_id = os.environ.get('RELEASE_RUN_ID', '').strip()
    release_tag = os.environ.get('RELEASE_TAG', '').strip()
    is_deploy = os.environ.get('IS_DEPLOY', 'false').lower() == 'true' or bool(release_id or release_tag)

    current = api('/actions/runs/' + os.environ['GITHUB_RUN_ID'])
    if current.get('event') != 'workflow_dispatch' or current.get('head_branch') != 'next':
        raise ValueError('Approval must be manually dispatched on protected next')
    actor = current.get('trigger_actor') or current.get('actor') or {}
    if actor.get('login') != 'deytenit':
        raise ValueError('Only the repository owner may approve promotion')
    if not api('/branches/next').get('protected'):
        raise ValueError('The next branch must be protected before promotion')

    if is_deploy:
        if not release_id:
            runs_data = api('/actions/workflows/workflow_dispatch-services-www-release.yml/runs?branch=next&limit=10')
            candidates = [
                r for r in runs_data.get('workflow_runs', [])
                if r.get('status') == 'completed' and r.get('conclusion') == 'success'
            ]
            if not candidates:
                raise ValueError('No successful completed run found for workflow_dispatch-services-www-release.yml on next')
            release_id = str(candidates[0]['id'])

        release = api('/actions/runs/' + release_id)
        release_actor = release.get('trigger_actor') or release.get('actor') or {}
        if release.get('conclusion') != 'success' or release.get('status') != 'completed' or release.get('event') != 'workflow_dispatch' or release.get('head_branch') != 'next' or release.get('path') != 'workflow_dispatch-services-www-release.yml@refs/heads/next' or release_actor.get('login') != 'deytenit':
            raise ValueError('Successful independently approved release required')

        rel_manifest = artifact_manifest(release_id, 'www-release-provenance', 'www-release.json')
        if not release_tag:
            release_tag = rel_manifest['release_tag']
        if not sha:
            sha = rel_manifest['sha']
        if not digest:
            digest = rel_manifest['digest']
        if not run_id:
            run_id = str(rel_manifest['run_id'])

        expected_rel = {'sha': sha, 'digest': digest, 'run_id': str(run_id), 'repository': REPO, 'release_tag': release_tag}
        if any(str(rel_manifest.get(k)) != str(v) for k, v in expected_rel.items()):
            raise ValueError(f'Release approval does not match requested artifact: got {rel_manifest}, expected {expected_rel}')
    else:
        if not sha or not digest or not run_id:
            runs_data = api('/actions/workflows/push-services-www-ci-build.yml/runs?branch=next&limit=10')
            candidates = [
                r for r in runs_data.get('workflow_runs', [])
                if r.get('status') == 'completed' and r.get('conclusion') == 'success'
            ]
            if not candidates:
                raise ValueError('No successful completed run found for push-services-www-ci-build.yml on next')
            build_run = candidates[0]
            run_id = str(build_run['id'])
            sha = build_run['head_sha']
            build_manifest = artifact_manifest(run_id, 'www-provenance', 'www-provenance.json')
            digest = build_manifest['digest']

    validate_input(sha, digest, run_id)
    validate_run(api('/actions/runs/' + run_id), sha)
    validate_manifest(artifact_manifest(run_id), sha, digest, run_id)

    auth = base64.b64encode(('deytenit:' + os.environ['PROVENANCE_TOKEN']).encode()).decode()
    subprocess.run(['git', '-c', 'http.https://git.ermnvldmr.com/.extraheader=AUTHORIZATION: basic ' + auth, 'fetch', 'origin', 'next'], check=True)
    subprocess.run(['git', 'merge-base', '--is-ancestor', sha, 'origin/next'], check=True)
    subprocess.run(['docker', 'pull', IMAGE + '@' + digest], check=True)
    data = json.loads(subprocess.check_output(['docker', 'image', 'inspect', IMAGE + '@' + digest], text=True))
    validate_labels(data[0]['Config'].get('Labels') or {}, sha, run_id)

    with open(os.environ['GITHUB_OUTPUT'], 'a') as stream:
        stream.write(f'short_sha=sha-{sha[:7]}\n')
        stream.write(f'tested_sha={sha}\n')
        stream.write(f'tested_digest={digest}\n')
        stream.write(f'build_run_id={run_id}\n')
        if release_tag:
            stream.write(f'release_tag={release_tag}\n')
        if release_id:
            stream.write(f'release_run_id={release_id}\n')


if __name__ == '__main__':
    main()
