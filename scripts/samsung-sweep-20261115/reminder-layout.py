"""Scoped synthetic Refresh QA Add check; begin with an empty QA draft; never targets accepted packages."""
import subprocess,time,re,json,shlex,xml.etree.ElementTree as ET
from pathlib import Path
adb='/Volumes/FA-Development/Designs-by-FA/Android/QA-Tools/platform-tools-36.0.2/platform-tools/adb'
pkg='com.designsbyfa.casitadex.refreshqa';out=Path('docs/qa/evidence/samsung-full-sweep-20261115/reminder-layout');out.mkdir(parents=True,exist_ok=True)
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
# Only the disposable QA identity; native permission prompt verified separately.
run('shell','pm','grant',pkg,'android.permission.POST_NOTIFICATIONS')
run('shell','am','force-stop',pkg);route('');time.sleep(2)
for theme in ['Light','Dark']:
 route('settings-manage?action=appearance');tap(theme+' appearance');route('reminders')
 before=bounds(node('Add Reminder ›'));run('shell','input','swipe','540','1800','540','750','350')
 assert bounds(node('Add Reminder ›'))==before
 shot('android-reminders-'+theme)
 route('card?id=sb26qa_007');node('Edit Location');shot('android-details-'+theme);tap('Edit Location');node('Create new Location');tap('Cancel')
 route('reminders-manage?mode=new&memoryId=sb26qa_007');node('Save Reminder');shot('android-form-'+theme)
 before=bounds(node('Save Reminder'));tap('More options ▾');run('shell','input','swipe','540','1800','540','750','350');assert bounds(node('Save Reminder'))==before
 route('card?id=sb26qa_007')
 print(theme+' layout/inline/fixed actions PASS',flush=True)
route('reminders-manage?mode=new&memoryId=sb26qa_007');tap('Save Reminder');node('Edit memory');shot('android-linked-return')
route('settings-manage?action=appearance');tap('System appearance');route('')
(out/'android-results.json').write_text(json.dumps({'themes':['Light','Dark'],'fixed_actions':'PASS','inline_details':'PASS','linked_save_return':'PASS'},indent=2)+'\n')
print('REMINDER AND DETAILS ANDROID PASS',flush=True)
