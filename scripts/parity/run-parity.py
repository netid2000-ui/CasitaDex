#!/usr/bin/env python3
"""Guarded local-only SB40 parity runner. Never clears app state or promotes images."""
from pathlib import Path
import argparse,json,hashlib,subprocess,plistlib,sqlite3,os,re,copy,datetime,shutil
REPO=Path(__file__).resolve().parents[2]
BASE=Path('/Volumes/FA-Development/Designs-by-FA')
CONFIG=json.loads((Path(__file__).with_name('sb40-targets.json')).read_text())
ADB=str(BASE/'Android/Sdk/platform-tools/adb')
MAESTRO=str(BASE/'Tools/MaestroCLI/bin/maestro')
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def cmd(*args):return subprocess.check_output(args,text=True).strip()
def gate(platform,target):
 appid=CONFIG['appId'];device=target['device']
 if platform=='ios':
  app=Path(cmd('xcrun','simctl','get_app_container',device,appid,'app'))
  info=plistlib.loads((app/'Info.plist').read_bytes());assert info['CFBundleIdentifier']==appid,'Bundle ID mismatch'
  actual={'executableSha256':sha(app/info['CFBundleExecutable']),'bundleSha256':sha(app/'main.jsbundle')}
  for key in actual:assert actual[key]==target[key],key+' mismatch; UI execution blocked'
  data=Path(cmd('xcrun','simctl','get_app_container',device,appid,'data'))
  db=next(data.rglob('casitadex-development-v1.db'));c=sqlite3.connect(db.as_uri()+'?mode=ro',uri=True)
  snapshot=json.loads(c.execute('SELECT payload FROM eng_state_v2 WHERE slot=1').fetchone()[0]);c.close()
  assert snapshot['draft'] is None,'Existing draft retained; parity capture blocked'
 else:
  avd=cmd(ADB,'-s',device,'emu','avd','name').splitlines()[0].strip();assert avd==target['avd'],'AVD identity mismatch'
  package=cmd(ADB,'-s',device,'shell','pm','path',appid);assert package.startswith('package:'),'Package absent'
  path=package[8:];assert re.fullmatch(r'/data/app/[A-Za-z0-9_~/=+.-]+/base.apk',path),'Unexpected package path'
  actual={'apkSha256':cmd(ADB,'-s',device,'shell','sha256sum',path).split()[0]}
  assert actual['apkSha256']==target['apkSha256'],'APK mismatch; UI execution blocked'
 return {'status':'PASS','device':device,'appId':appid,**actual}
def main():
 p=argparse.ArgumentParser();p.add_argument('platform',choices=['ios','android']);p.add_argument('--reference',action='store_true');p.add_argument('--prove-guard-rejects',action='store_true');p.add_argument('--flow',choices=['capture','journey'],default='capture');p.add_argument('--run-id');args=p.parse_args()
 assert not(args.reference and args.flow!='capture'),'Reference devices are read-only capture targets'
 role='reference' if args.reference else 'candidate';target=copy.deepcopy(CONFIG['references' if args.reference else 'targets'][args.platform])
 runid=args.run_id or datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
 assert re.fullmatch(r'[A-Za-z0-9_-]{1,80}',runid),'Invalid run ID'
 out=BASE/'QA-Evidence/Parity/CasitaDex'/runid/args.platform/role;out.mkdir(parents=True,exist_ok=False)
 report={'platform':args.platform,'role':role,'runId':runid,'sourceCommit':None if args.reference else CONFIG['sourceCommit'],'candidateSourceCommit':CONFIG['sourceCommit'],'flow':args.flow,'identity':'PENDING','functional':'NOT_RUN','visual':'NOT_RUN','baselinePromotion':'NEVER_AUTOMATIC'}
 try:
  if args.prove_guard_rejects:
   key='bundleSha256' if args.platform=='ios' else 'apkSha256';target[key]='0'*64
   try:gate(args.platform,target)
   except AssertionError as error:
    assert 'mismatch' in str(error);report.update(identity='NEGATIVE_TEST_PASS',functional='NOT_RUN',reason=str(error));return 0
   raise RuntimeError('Wrong build was not rejected')
  report['identity']=gate(args.platform,target)
  env=dict(os.environ);env['JAVA_HOME']=str(BASE/'Tools/Temurin-17.0.21+9/jdk-17.0.21+9/Contents/Home')
  env['PATH']=env['JAVA_HOME']+'/bin:'+str(Path.home()/'.nvm/versions/node/v24.22.1/bin')+':'+str(BASE/'Android/Sdk/platform-tools')+':'+env['PATH']
  env['ANDROID_HOME']=str(BASE/'Android/Sdk');env['ANDROID_AVD_HOME']=str(BASE/'Android/AVD')
  env['MAESTRO_CLI_NO_ANALYTICS']='true';env['TMPDIR']=str(BASE/'Tools/ParityTools/tmp');Path(env['TMPDIR']).mkdir(exist_ok=True)
  env['JAVA_TOOL_OPTIONS']='-Djava.io.tmpdir='+env['TMPDIR']
  command=[MAESTRO,'--device',target['device'],'test','--format','JUNIT','--output',str(out/'junit.xml'),'--debug-output',str(out/'debug'),'--test-output-dir',str(out/'artifacts'),'-e','APP_ID='+CONFIG['appId'],'-e','CAPTURE_DIR='+str(out),'-e','FIXTURE_TITLE=SB40 Parity '+runid,str(REPO/'.maestro/sb40-parity'/(args.flow+'.yaml'))]
  with (out/'maestro.log').open('w') as log:result=subprocess.run(command,env=env,stdout=log,stderr=subprocess.STDOUT,cwd=REPO)
  report.update(functional='PASS' if result.returncode==0 else 'FAIL',maestroExitCode=result.returncode)
  if result.returncode:return result.returncode
  if args.flow=='capture':
   for name in ['home','add','inline-location']:
    matches=[f for f in (out/'artifacts').rglob(name+'.png') if f.parent.name=='takeScreenshot'];assert len(matches)==1,(name,'capture absent or ambiguous');shutil.copy2(matches[0],out/(name+'.png'))
   report['captures']={name:sha(out/(name+'.png')) for name in ['home','add','inline-location']}
   if args.reference:
    report['visual']='VERIFIED_ACCEPTED_BUILD_REFERENCE_CAPTURE';report['approval']='Artifact authority only; no new design approval inferred'
   else:report['visual']='READY_FOR_EXPLICIT_REFERENCE_COMPARISON'
  return 0
 except Exception as error:
  report.update(error=str(error),functional='BLOCKED' if report['functional']=='NOT_RUN' else report['functional']);return 2
 finally:
  (out/'report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report),flush=True)
if __name__=='__main__':raise SystemExit(main())
