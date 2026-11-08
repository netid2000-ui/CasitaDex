from pathlib import Path
import subprocess,xml.etree.ElementTree as E,re,json,time
out=Path('/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/sb40-four-items-20261108')
adb='/Volumes/FA-Development/Designs-by-FA/Android/Sdk/platform-tools/adb';serial='emulator-5554';bid='com.designsbyfa.casitadex.sb40qa'
title='SB40 Android acceptance memory';space='SB40 Android Space';category='SB40 Android Category'
def a(*args):return subprocess.check_output([adb,'-s',serial,*args],text=True)
def tree():
 a('shell','uiautomator','dump','/sdcard/sb40-window.xml')
 return E.fromstring(a('shell','cat','/sdcard/sb40-window.xml'))
def match(root,label,kind=None):
 return [n for n in root.iter('node') if (n.get('content-desc')==label or n.get('text')==label) and (kind is None or n.get('class','').endswith(kind))]
def bounds(n):return list(map(int,re.findall(r'-?\d+',n.get('bounds'))))
def swipe(up=True):a('shell','input','swipe','540','1850' if up else '900','540','900' if up else '1850','350')
def top():
 for _ in range(4):swipe(False)
def tap(label,index=0,kind='Button',sticky=False):
 for i in range(14):
  root=tree();nodes=match(root,label,kind);minY=700 if any(n.get('content-desc') in ['Save','Save Reminder','Save & return to details','Edit memory'] for n in root.iter('node')) else 310
  if len(nodes)<=index:swipe();continue
  n=nodes[index];x1,y1,x2,y2=bounds(n);y=(y1+y2)//2
  if y2<=y1:
   swipe(y2>=720);continue
  if y>2050:swipe();continue
  if not sticky and y<minY:swipe(False);continue
  assert n.get('enabled')=='true',(label,'disabled')
  a('shell','input','tap',str((x1+x2)//2),str(y));return
 raise RuntimeError('Cannot reach '+label)
def fill(label,value):
 for i in range(14):
  nodes=match(tree(),label,'EditText')
  if not nodes:swipe();continue
  n=nodes[0];x1,y1,x2,y2=bounds(n);y=(y1+y2)//2
  if y2<=y1:
   swipe(y2>=720);continue
  if y>1950:swipe();continue
  if y<720 and label!='Search memories':swipe(False);continue
  a('shell','input','tap',str((x1+x2)//2),str(y))
  old=n.get('text','');old='' if old==n.get('hint') else old
  if old:
   a('shell','input','keyevent','123')
   a('shell','input','keyevent',*(['67']*len(old)))
   cleared=match(tree(),label,'EditText');assert cleared and (not cleared[0].get('text') or cleared[0].get('text')==cleared[0].get('hint')),(label,'clear incomplete')
  a('shell','input','text',value.replace(' ','%s'))
  a('shell','input','keyevent','4')
  nodes=match(tree(),label,'EditText')
  assert nodes and nodes[0].get('text')==value,(label,'input value mismatch')
  return
 raise RuntimeError('Cannot fill '+label)
def visible(text):
 return any(n.get('text')==text or n.get('content-desc')==text for n in tree().iter('node'))
def log(case,**details):
 row={'case':case,'status':'PASS',**details};print(json.dumps(row),flush=True)
 with (out/'android-native-journal.jsonl').open('a') as f:f.write(json.dumps(row)+'\n')
def screenshot(name):
 with (out/name).open('wb') as f:subprocess.run([adb,'-s',serial,'exec-out','screencap','-p'],stdout=f,check=True)
def contains(value):
 return any(value in n.get('text','') for n in tree().iter('node'))
try:
 fill('Search memories',title);tap('Open regular memory '+title);top();assert visible(category);assert not contains(category+' B');assert not contains(space);log('label-removal-retains-memory-and-other-category')
 a('shell','am','force-stop',bid);a('shell','monkey','-p',bid,'1');tap('Find a memory');fill('Search memories',title);tap('Open regular memory '+title);top();assert visible(category);assert not contains(category+' B');log('managed-taxonomy-survives-relaunch');screenshot('android-taxonomy-managed-final.png')
 (out/'android-final-tree.xml').write_text(E.tostring(tree(),encoding='unicode'))
except Exception:
 (out/'android-final-assertion-failure.xml').write_text(E.tostring(tree(),encoding='unicode'));screenshot('android-final-assertion-failure.png');raise
