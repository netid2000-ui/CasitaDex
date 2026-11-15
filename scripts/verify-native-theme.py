"""Run the isolated iOS theme UI test; do not target an accepted owner build."""
from pathlib import Path
import subprocess, json, time, sqlite3, hashlib, os
ROOT=Path('/Volumes/FA-Development/Designs-by-FA/Development/CasitaDex/sb40-photo-gesture-integration-20261111')
BUILD=Path('/Volumes/FA-Development/Designs-by-FA/Development/CasitaDex/plus-store-native-qa-20261114')
OUT=Path('/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex-Plus-Window-20261114/Theme-r2')
SIM='81FC3CCE-ACEB-4957-BE61-C9C653A4CE56'
MAIN='879C620A-5318-4BDF-98B9-904EE635B053'
BUNDLE='com.designsbyfa.casitadex.plusstoreqa'
OUT.mkdir(parents=True,exist_ok=False)
def call(args,**kw): return subprocess.run(args,check=True,text=True,capture_output=True,**kw).stdout.strip()
app_containers={}
def container(sim,bundle):
 if bundle==BUNDLE and sim==MAIN and sim in app_containers: return app_containers[sim]
 result=Path(call(['xcrun','simctl','get_app_container',sim,bundle,'data']))
 if bundle==BUNDLE: app_containers[sim]=result
 return result
def state(sim):
 p=container(sim,BUNDLE)/'Documents/SQLite/casitadex-development-v1.db'
 with sqlite3.connect('file:'+str(p)+'?mode=ro',uri=True) as db:
  payload=db.execute('select payload from eng_state_v2 where slot=1').fetchone()[0]
 parsed=json.loads(payload)
 return {'sha256':hashlib.sha256(payload.encode()).hexdigest(),'memories':len(parsed['data']['memories'])}
before={MAIN:state(MAIN)}
(OUT/'before.json').write_text(json.dumps(before,indent=2)+'\n')
devices=json.loads(call(['xcrun','simctl','list','devices','-j']))
main_was_booted=any(d['udid']==MAIN and d['state']=='Booted' for group in devices['devices'].values() for d in group)
old_theme=None;process=None
try:
 if main_was_booted: call(['xcrun','simctl','shutdown',MAIN])
 call(['xcrun','simctl','boot',SIM])
 call(['xcrun','simctl','bootstatus',SIM,'-b'],timeout=100)
 before[SIM]=state(SIM)
 (OUT/'before.json').write_text(json.dumps(before,indent=2)+'\n')
 subprocess.run(['open','-a','/Applications/Xcode.app/Contents/Applications/DeviceHub.app','--args','-CurrentDeviceUDID',SIM],check=False)
 old_theme=call(['xcrun','simctl','ui',SIM,'appearance']).strip().lower()
 runner=container(SIM,BUNDLE+'.recoveryuitests.xctrunner')/'Documents'
 for filename in ['theme-stage.json','theme-advance.txt']:
  (runner/filename).unlink(missing_ok=True)
 command=['xcodebuild','-workspace','ios/CasitaDexPlusStoreQA.xcworkspace','-scheme','PlusRecoveryUITests','-configuration','Debug','-sdk','iphonesimulator','-destination','platform=iOS Simulator,id='+SIM,'-derivedDataPath','/Volumes/FA-Development/Designs-by-FA/Apple-Builds/CasitaDex-Plus-Store-Native-20261114','-parallel-testing-enabled','NO','-only-testing:PlusRecoveryUITests/PlusRecoveryUITests/testNativeThemeSwitching','-resultBundlePath',str(OUT/'Theme.xcresult'),'CODE_SIGNING_ALLOWED=YES','CODE_SIGN_IDENTITY=-','DEVELOPMENT_TEAM=VSP8XSM3BK','test']
 env=os.environ.copy();env.update(CASITADEX_PLUS_STORE_QA='1',FORCE_BUNDLING='1')
 with (OUT/'xcodebuild.log').open('w') as log:
  process=subprocess.Popen(command,cwd=BUILD,env=env,stdout=log,stderr=subprocess.STDOUT)
  handled=set();events=[];start=time.monotonic()
  while process.poll() is None:
   if time.monotonic()-start>900:
    process.terminate();raise TimeoutError('Native theme run exceeded 15 minutes')
   try:
    runner=container(SIM,BUNDLE+'.recoveryuitests.xctrunner')/'Documents'
    item=json.loads((runner/'theme-stage.json').read_text())
    if item['stage'] not in handled:
     assert item['device'] in ['light','dark']
     call(['xcrun','simctl','ui',SIM,'appearance',item['device']])
     actual=call(['xcrun','simctl','ui',SIM,'appearance'])
     assert item['device'] in actual.lower(),actual
     events.append(dict(item,verifiedDeviceAppearance=actual));handled.add(item['stage'])
     (OUT/'device-events.json').write_text(json.dumps(events,indent=2)+'\n')
     (runner/'theme-advance.txt').write_text(item['stage'])
     print('DEVICE_THEME '+item['stage']+' '+actual,flush=True)
   except (FileNotFoundError,json.JSONDecodeError,subprocess.CalledProcessError):
    pass
   time.sleep(0.5)
  result=process.returncode
 summary=call(['xcrun','xcresulttool','get','test-results','summary','--path',str(OUT/'Theme.xcresult')])
 (OUT/'summary.json').write_text(summary+'\n')
 print(summary,flush=True)
 subprocess.run(['xcrun','simctl','terminate',SIM,BUNDLE],capture_output=True)
 after={s:state(s) for s in [SIM,MAIN]}
 assert before==after, 'Memory database changed'
 (OUT/'preservation.json').write_text(json.dumps({'before':before,'after':after,'unchanged':True},indent=2)+'\n')
 print('DATA_PRESERVED '+json.dumps(after),flush=True)
 if result: raise RuntimeError('xcodebuild exit '+str(result))
finally:
 if process is not None and process.poll() is None: process.terminate();process.wait(timeout=30)
 if old_theme in ['light','dark']: subprocess.run(['xcrun','simctl','ui',SIM,'appearance',old_theme],capture_output=True)
 subprocess.run(['xcrun','simctl','shutdown',SIM],capture_output=True)
 if main_was_booted:
  subprocess.run(['xcrun','simctl','boot',MAIN],capture_output=True)
  subprocess.run(['xcrun','simctl','bootstatus',MAIN,'-b'],capture_output=True,timeout=100)
  subprocess.run(['xcrun','simctl','launch',MAIN,BUNDLE],capture_output=True)
  subprocess.run(['open','-a','/Applications/Xcode.app/Contents/Applications/DeviceHub.app','--args','-CurrentDeviceUDID',MAIN],capture_output=True)
