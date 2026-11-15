"""Scoped synthetic Refresh QA Add check; begin with an empty QA draft; never targets accepted packages."""
import subprocess,time,re,json,shlex,xml.etree.ElementTree as ET
from pathlib import Path
adb='/Volumes/FA-Development/Designs-by-FA/Android/QA-Tools/platform-tools-36.0.2/platform-tools/adb'
pkg='com.designsbyfa.casitadex.refreshqa';out=Path('docs/qa/evidence/samsung-full-sweep-20261115/detail-controls');out.mkdir(parents=True,exist_ok=True)
def run(*args):return subprocess.check_output([adb,'-s','R5GL83X0K3N',*args])
def route(path):run('shell','am','start','-a','android.intent.action.VIEW','-d',shlex.quote('casitadex-refreshqa://'+path),pkg);time.sleep(1)
def tree():
 run('shell','uiautomator','dump','/sdcard/cd-editor.xml');return ET.fromstring(run('shell','cat','/sdcard/cd-editor.xml'))
def bounds(n):return list(map(int,re.findall(r'\d+',n.get('bounds'))))
def node(label,kind=None):
 for _ in range(14):
  t=tree();matches=[n for n in t.iter('node') if n.get('content-desc')==label and (kind is None or n.get('class','').endswith(kind))]
  for n in matches:
   x1,y1,x2,y2=bounds(n)
   if 70<=y1<y2<2150:return n
  run('shell','input','swipe','540','1800','540','750','350');time.sleep(.2)
 raise AssertionError('Not visible: '+label)
def tap(label):
 n=node(label);x1,y1,x2,y2=bounds(n);run('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2));time.sleep(.4)
def shot(name):
 (out/(name+'.png')).write_bytes(run('exec-out','screencap','-p'));(out/(name+'.xml')).write_bytes(ET.tostring(tree()))



out.mkdir(parents=True,exist_ok=True)
run('shell','am','force-stop',pkg);route('');time.sleep(2)
for theme in ['Light','Dark']:
 route('settings-manage?action=appearance');tap(theme+' appearance')
 route('reminders-manage?mode=new');node('Save Reminder')
 for pattern,kind in [(r'\d{4}-\d{2}-\d{2}','date'),(r'\d{1,2}:\d{2}\s[AP]M','time')]:
  controls=[n.get('content-desc') for n in tree().iter('node') if re.fullmatch(pattern,n.get('content-desc',''))]
  assert len(controls)==1,controls
  tap(controls[0]);t=tree();assert any(n.get('text','').lower()=='cancel' for n in t.iter('node'))
  run('shell','input','keyevent','4');node('Save Reminder')
 shot('android-form-'+theme);tap('Cancel')
 route('card?id=sb26qa_007');node('Edit memory');shot('android-details-top-'+theme)
 before=bounds(node('Edit memory'));node('Edit Location');assert bounds(node('Edit memory'))==before
 shot('android-details-lower-'+theme);tap('Edit Location');node('Create new Location');tap('Cancel');tap('Cancel')
 node('Set Reminder ›');tap('Set Reminder ›');node('Save Reminder')
 route('card?id=sb26qa_007');node('Share memory ›')
 print(theme+' picker/details/direct reminder PASS',flush=True)
route('settings-manage?action=appearance');tap('System appearance');route('')
(out/'android-results.json').write_text(json.dumps({'result':'PASS','themes':['Light','Dark'],'native_pickers':'open/cancel','details_inline':'PASS','fixed_actions':'PASS','direct_reminder':'PASS','share_action':'present, not sent','photos':'not exercised'},indent=2)+'\n')
