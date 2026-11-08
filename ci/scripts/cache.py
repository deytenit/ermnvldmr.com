import hashlib
import json
import os
import platform
import subprocess
import sys
import tarfile
import tempfile
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path

SERVER='https://git.ermnvldmr.com'


def eligible(run, repository, current_run):
    if run.get('repository',{}).get('full_name')!=repository:
        return False
    if str(run.get('id'))==current_run:
        return True
    return run.get('head_branch')=='next' and run.get('event') in ('push','workflow_dispatch') and run.get('status')=='completed' and run.get('conclusion')=='success'


def request(url):
    if not url.startswith(SERVER+'/'):
        raise ValueError('Unexpected cache artifact host')
    class LocalRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            if not newurl.startswith(SERVER+'/'):
                raise ValueError('Unexpected cache storage host')
            return super().redirect_request(req,fp,code,msg,headers,newurl)
    req=urllib.request.Request(url,headers={'Authorization':'token '+os.environ['CACHE_TOKEN']})
    return urllib.request.build_opener(LocalRedirect).open(req,timeout=60)


def api(path):
    with request(SERVER+'/api/v1/repos/'+os.environ['GITHUB_REPOSITORY']+path) as response:
        return json.load(response)


def main():
    store=Path(subprocess.check_output(['pnpm','store','path','--silent'],text=True).strip())
    archive=Path('.ci/pnpm-store.tar')
    if sys.argv[1]=='pack':
        archive.parent.mkdir(exist_ok=True)
        store.mkdir(parents=True,exist_ok=True)
        with tarfile.open(archive,'w') as target:target.add(store,arcname='.')
        return
    versions=subprocess.check_output(['node','--version'],text=True).strip()+'-'+subprocess.check_output(['pnpm','--version'],text=True).strip()
    key='pnpm-'+platform.system().lower()+'-'+platform.machine()+'-'+versions+'-'+hashlib.sha256(Path('pnpm-lock.yaml').read_bytes()).hexdigest()
    with open(os.environ['GITHUB_OUTPUT'],'a') as output:output.write('key='+key+'\n')
    try:
        artifacts=api('/actions/artifacts?name='+urllib.parse.quote(key))['artifacts']
        artifacts.sort(key=lambda a:a['id'],reverse=True)
        for artifact in artifacts:
            if artifact.get('expired',True) or artifact.get('name')!=key:
                continue
            run_id=artifact.get('workflow_run',{}).get('id')
            if not run_id:
                continue
            run=api('/actions/runs/'+str(run_id))
            if not eligible(run,os.environ['GITHUB_REPOSITORY'],os.environ['GITHUB_RUN_ID']):
                continue
            with tempfile.TemporaryDirectory(prefix='pnpm-artifact-cache-') as directory:
                downloaded=Path(directory)/'cache.zip'
                with request(SERVER+'/api/v1/repos/'+os.environ['GITHUB_REPOSITORY']+'/actions/artifacts/'+str(artifact['id'])+'/zip') as response,downloaded.open('wb') as target:
                    while chunk:=response.read(1048576):target.write(chunk)
                with zipfile.ZipFile(downloaded) as zipped:
                    members=[name for name in zipped.namelist() if name.rsplit('/',1)[-1]=='pnpm-store.tar']
                    if len(members)!=1:
                        raise ValueError('Invalid cache archive')
                    packed=Path(directory)/'store.tar'
                    with zipped.open(members[0]) as source,packed.open('wb') as target:
                        while chunk:=source.read(1048576):target.write(chunk)
                store.mkdir(parents=True,exist_ok=True)
                with tarfile.open(packed) as tar:tar.extractall(store,filter='data')
            print('Restored repository-scoped pnpm cache artifact')
            return
    except (urllib.error.HTTPError,urllib.error.URLError,ValueError,tarfile.TarError,zipfile.BadZipFile):
        print('Cache unavailable; dependencies will be fetched normally')
        return
    print('No eligible cache artifact; dependencies will be fetched normally')


if __name__=='__main__':main()
