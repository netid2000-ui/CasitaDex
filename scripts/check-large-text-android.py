"""Scoped synthetic Refresh QA Add check; begin with an empty QA draft; never targets accepted packages."""
import subprocess,time,re,json,shlex,xml.etree.ElementTree as ET
from pathlib import Path
adb='/Volumes/FA-Development/Designs-by-FA/Android/Sdk/platform-tools/adb'
pkg='com.designsbyfa.casitadex.refreshqa';out=Path('docs/qa/evidence/large-text-20261115')
def run(*args):return subprocess.check_output([adb,'-s','emulator-5554',*args])
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
original=run('shell','settings','get','system','font_scale').decode().strip()
try:
 run('shell','settings','put','system','font_scale','2.0')
 run('shell','am','force-stop',pkg);route('');time.sleep(2)
 for theme in ['Light','Dark']:
  route('settings-manage?action=appearance');tap(theme+' appearance')
  for name,path in [('home',''),('find','answers'),('settings','more'),('add','add'),('details','card?id=sb26qa_007'),('reminder-form','reminders-manage?mode=new'),('reminders','reminders')]:
   route(path);shot('android-large-'+theme+'-'+name)
   if name in ['add','reminder-form']:node('Cancel')
   if name=='details':node('Edit memory')
  node('Add Reminder ›')
  upcoming=next(n for n in tree().iter('node') if n.get('content-desc','').startswith('Upcoming ('))
  _,y1,_,y2=bounds(upcoming);y=str((y1+y2)//2)
  run('shell','input','swipe','950',y,'100',y,'350')
  dates=next(n for n in tree().iter('node') if n.get('content-desc','').startswith('Memory dates ('))
  x1,y1,x2,y2=bounds(dates);assert 0<=x1<x2<=1080 and y1<y2
  run('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2));shot('android-large-'+theme+'-last-filter')
  print(theme+' 2.0 font scale reachable controls PASS',flush=True)
 route('settings-manage?action=appearance');tap('System appearance')
 (out/'android-results.json').write_text(json.dumps({'result':'PASS scoped controls','font_scale':2.0,'themes':['Light','Dark'],'screenshots':'seven core screens per theme','screen_reader':'manual TalkBack not performed'},indent=2)+'\n')
finally:
 run('shell','settings','put','system','font_scale',original)
 run('shell','am','force-stop',pkg);route('')
 print('Restored original font scale '+original,flush=True)
