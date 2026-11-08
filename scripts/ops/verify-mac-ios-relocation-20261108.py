#!/usr/bin/env python3
from pathlib import Path
import subprocess,json,hashlib,sqlite3,os
BASE=Path('/Volumes/FA-Development/Designs-by-FA')
OUT=BASE/'QA-Evidence/MacMini/storage-migration-20261108'
ROOT=Path.home()/'Library/Developer/CoreSimulator/Devices'
DEST=BASE/'Apple-Builds/CoreSimulator/Devices'
BUNDLE='com.designsbyfa.casitadex.sb40qa'
def command(*args):return subprocess.check_output(args,text=True)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def identities(doc):
 return sorted((runtime,d['udid'],d['name']) for runtime,devices in doc['devices'].items() for d in devices)
def snapshot(db):
 c=sqlite3.connect(db.as_uri()+'?mode=ro',uri=True)
 payload=c.execute('SELECT payload FROM eng_state_v2 WHERE slot=1').fetchone()[0];c.close()
 return hashlib.sha256(payload.encode()).hexdigest(),len(json.loads(payload)['data']['memories'])
def assert_saved_rows(rows):
 for row in rows:
  if 'appRelativePath' in row:
   app=ROOT/row['appRelativePath'];assert sha(app/'CasitaDexSB40QA')==row['executableSha256'];assert sha(app/'main.jsbundle')==row['bundleSha256']
  else:
   got,count=snapshot(ROOT/row['dbRelativePath']);assert got==row['snapshotSha256'];assert count==row['memoryCount']
result={'status':'VERIFYING'}
try:
 state=json.loads((OUT/'simulators-migration.json').read_text());assert state['status']=='SWITCHED_VERIFIED'
 assert ROOT.is_symlink() and ROOT.resolve()==DEST.resolve()
 assert ROOT.stat().st_dev==Path('/Volumes/FA-Development').stat().st_dev
 before=json.loads((OUT/'devices-before.json').read_text());after=json.loads(command('xcrun','simctl','list','devices','--json'))
 assert identities(before)==identities(after),'Simulator device identities changed'
 rows=json.loads((OUT/'sb40-before.json').read_text());assert_saved_rows(rows)
 result.update(deviceIdentityCount=len(identities(after)),allDeviceIdentitiesPreserved=True,allProtectedAppAndSnapshotHashesPreserved=True)
 for uid,role in [('AD06A0B7-D723-4EE9-829C-03508DD1107B','accepted-reference'),('A4ED0D8B-C90A-4940-9B71-4F570D7DC597','household-qa')]:
  subprocess.run(['xcrun','simctl','boot',uid],check=True)
  subprocess.run(['xcrun','simctl','bootstatus',uid,'-b'],check=True,timeout=240)
  app=Path(command('xcrun','simctl','get_app_container',uid,BUNDLE,'app').strip());assert app.resolve().is_relative_to(DEST.resolve())
  subprocess.run(['xcrun','simctl','launch',uid,BUNDLE],check=True)
  subprocess.run(['xcrun','simctl','io',uid,'screenshot',str(OUT/(role+'-after-relocation.png'))],check=True)
  assert_saved_rows(rows);result[role]={'boot':'PASS','launch':'PASS','dataUnchanged':'PASS'}
  print(role,'BOOT_LAUNCH_DATA_PASS',flush=True)
  if role=='accepted-reference':subprocess.run(['xcrun','simctl','shutdown',uid],check=True)
 result.update(status='PASS',retainedInternalCopyMayBeRetired=True)
except Exception as error:
 result.update(status='FAILED',error=str(error),retainedInternalCopyMayBeRetired=False)
 raise
finally:(OUT/'ios-relocation-verification.json').write_text(json.dumps(result,indent=2)+'\n')
