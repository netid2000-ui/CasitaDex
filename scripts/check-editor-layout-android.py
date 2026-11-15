"""Scoped synthetic Refresh QA editor check; never targets accepted packages."""
import subprocess,time,re,json,xml.etree.ElementTree as ET
from pathlib import Path
adb='/Volumes/FA-Development/Designs-by-FA/Android/Sdk/platform-tools/adb'
pkg='com.designsbyfa.casitadex.refreshqa';out=Path('docs/qa/evidence/editor-layout-20261114')
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
run('shell','am','force-stop',pkg);route('');time.sleep(2)
route('settings-manage?action=appearance');tap('Light appearance')
route('card?id=sb26qa_007');tap('Edit memory');shot('android-light-editor-top')
original={}
for label in ['Location','Notes','Reference']:
 tap('Edit '+label);field=node(label,'EditText');original[label]=field.get('text','');x1,y1,x2,y2=bounds(field);run('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2));run('shell','input','text','QAAndroidCancel');
 tap('Done editing '+label);node('Edit '+label);print(label+' edit/close PASS',flush=True)
shot('android-light-editor-lower');tap('Cancel')
run('shell','am','force-stop',pkg);route('card?id=sb26qa_007');tap('Edit memory')
for label in original:
 tap('Edit '+label);assert node(label,'EditText').get('text','')==original[label],label;tap('Done editing '+label)
tap('Cancel');print('Cancel and cold restart preserve all three values PASS',flush=True)
route('settings-manage?action=appearance');tap('Dark appearance');route('card?id=sb26qa_007');tap('Edit memory');shot('android-dark-editor-top');node('Edit Reference');shot('android-dark-editor-lower');tap('Cancel')
route('settings-manage?action=appearance');tap('System appearance');route('')
(out/'android-results.json').write_text(json.dumps({'result':'PASS','fields':list(original),'cancel_restart':'PASS','themes':['Light','Dark'],'appearance_restored':'System'},indent=2)+'\n')
print('ANDROID EDITOR PASS',flush=True)
