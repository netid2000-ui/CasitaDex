"""Supervise the separate-runner local StoreKit restart test using native evidence only."""
import argparse, json, plistlib, subprocess, time
from pathlib import Path
parser=argparse.ArgumentParser()
parser.add_argument('--simulator',required=True)
parser.add_argument('--report',required=True)
args=parser.parse_args()
bundle='com.designsbyfa.casitadex.plusstoreqa'
def container(name):
 return Path(subprocess.check_output(['xcrun','simctl','get_app_container',args.simulator,name,'data'],text=True).strip())
runner=container(bundle+'.recoveryuitests.xctrunner')/'Documents'
app=container(bundle)
def current():
 stage=json.loads((runner/'plus-recovery-stage.json').read_text())
 prefs=plistlib.loads((app/'Library/Preferences'/ (bundle+'.plist')).read_bytes())
 return stage,prefs
stage,prefs=current()
output=Path(args.report)
if stage['stage']=='seed':
 tx=stage['transaction']
 seed_pid=prefs.get('CasitaDexPlusQABridgePID')
 assert prefs.get('CasitaDexPlusQABridgeState')=='ready:plus'
 assert tx in prefs.get('CasitaDexPlusQADeferredIDs',[])
 assert seed_pid and prefs.get('CasitaDexPlusQADeferredPID')==seed_pid
 assert prefs.get('CasitaDexPlusQAFinishPID')!=seed_pid,'Seed process must not finish'
 report={'transaction':tx,'seedPID':seed_pid,'seedOwned':True,'seedUnfinished':True,'result':'pending'}
 output.write_text(json.dumps(report,indent=2)+'\n')
 (runner/'plus-recovery-advance.txt').write_text('seed-verified')
 print('Seed verified; app-only restart released',flush=True)
else:
 assert stage['stage']=='restarted'
 report=json.loads(output.read_text())
 tx=report['transaction'];seed_pid=report['seedPID']
 assert tx==stage['transaction'] and report['seedUnfinished']
for _ in range(120):
 try:
  stage,prefs=current()
  pid=prefs.get('CasitaDexPlusQABridgePID')
  if (stage['stage']=='restarted' and stage['transaction']==tx and pid and pid!=seed_pid
      and prefs.get('CasitaDexPlusQABridgeState')=='ready:plus'
      and prefs.get('CasitaDexPlusQAFinishPID')==pid
      and prefs.get('CasitaDexPlusQAFinishCount',0)>0
      and tx in prefs.get('CasitaDexPlusQAFinishedIDs',[])):
   report.update(restartedPID=pid,restartedOwned=True,sameTransactionFinished=True,result='passed')
   output.write_text(json.dumps(report,indent=2)+'\n')
   (runner/'plus-recovery-advance.txt').write_text('recovery-verified')
   print(json.dumps(report),flush=True)
   break
 except (FileNotFoundError,json.JSONDecodeError,plistlib.InvalidFileException):
  pass
 time.sleep(1)
else:
 report.update(result='failed',lastStage=stage,lastQADiagnostics={k:v for k,v in prefs.items() if k.startswith('CasitaDexPlusQA')})
 output.write_text(json.dumps(report,indent=2)+'\n')
 raise AssertionError('New process did not finish the same transaction within 120 seconds')
