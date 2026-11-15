"""Scoped synthetic Refresh QA Add check; begin with an empty QA draft; never targets accepted packages."""
import subprocess,time,re,json,xml.etree.ElementTree as ET
from pathlib import Path
adb='/Volumes/FA-Development/Designs-by-FA/Android/Sdk/platform-tools/adb'
pkg='com.designsbyfa.casitadex.refreshqa';out=Path('docs/qa/evidence/add-android-20261115')
def run(*args):return subprocess.check_output([adb,'-s','emulator-5554',*args])
def route(path):run('shell','am','start','-a','android.intent.action.VIEW','-d','casitadex-refreshqa://'+path,pkg);time.sleep(1)
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
values={'Memory name (Required)':'QAAddDraft20261115','Description':'Scoped draft recovery','Location':'Garage shelf','Notes':'Retain these notes','Reference':'Manual reference'}
import sys
if '--resume' not in sys.argv:
 run('shell','am','force-stop',pkg);route('');time.sleep(2)
 route('settings-manage?action=appearance');tap('Light appearance');route('add');shot('light-top')
 for label,value in values.items():
  if label in ['Location','Notes','Reference']:tap('Edit '+label)
  field=node(label,'EditText');x1,y1,x2,y2=bounds(field);run('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2));run('shell','input','text',value.replace(' ','%s'))
  if label in ['Location','Notes','Reference']:tap('Done editing '+label)
  print('Entered '+label,flush=True)
 shot('light-lower');tap('Cancel')
run('shell','am','force-stop',pkg);route('add')
for label,value in values.items():
 if label in ['Location','Notes','Reference']:tap('Edit '+label)
 assert node(label,'EditText').get('text','')==value,label
 if label in ['Location','Notes','Reference']:tap('Done editing '+label)
print('All five draft fields survive Cancel and cold restart PASS',flush=True)
tap('Cancel');route('settings-manage?action=appearance');tap('Dark appearance');route('add');shot('dark-top')
node('Edit Reference');shot('dark-lower')
assert node('Save').get('enabled')=='true'
tap('Save');time.sleep(2);shot('saved')
run('shell','am','force-stop',pkg);route('answers')
fields=[n for n in tree().iter('node') if n.get('class','').endswith('EditText')]
assert fields
x1,y1,x2,y2=bounds(fields[0]);run('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2));run('shell','input','text',values['Memory name (Required)'])
time.sleep(1);shot('saved-search')
tap('Open regular memory '+values['Memory name (Required)']);tap('Edit memory')
for label,value in values.items():
 if label in ['Location','Notes','Reference']:tap('Edit '+label)
 assert node(label,'EditText').get('text','')==value,label
 if label in ['Location','Notes','Reference']:tap('Done editing '+label)
shot('saved-values');tap('Cancel')
print('Saved record cold restart and exact values PASS',flush=True)
route('settings-manage?action=appearance');tap('System appearance');route('')
(out/'results.json').write_text(json.dumps({'draft_cancel_restart':'PASS','fields':list(values),'themes':['Light','Dark'],'save':'PASS: saved record after restart matches all five values','appearance':'System'},indent=2)+'\n')
