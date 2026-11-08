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
  nodes=match(tree(),label,kind)
  if len(nodes)<=index:swipe();continue
  n=nodes[index];x1,y1,x2,y2=bounds(n);y=(y1+y2)//2
  if y2<=y1:
   swipe(y2>=720);continue
  if y>2050:swipe();continue
  if not sticky and y<720:swipe(False);continue
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
  old=n.get('text','')
  if old:
   a('shell','input','keyevent','123')
   a('shell','input','keyevent',*(['67']*len(old)))
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
try:
 fill('New Category name',category);tap('Create and assign');log('add-create-and-assign-category')
 tap('Save',sticky=True);tap('Find a memory');fill('Search memories','20x25x1');tap('Open regular memory '+title);assert visible(title);log('normalized-dimension-search')
 tap('Edit memory',sticky=True);top();tap('Choose ▾',0);tap('Select Space ▾');tap('None');tap('Cancel',sticky=True);top();assert visible(space);assert visible(category);log('cancel-space-edit-keeps-associations')
 tap('More ···',sticky=True);tap('Remind me later');tap('Save Reminder',sticky=True)
 root=tree()
 allow=match(root,'Allow','Button')
 if allow:tap('Allow',sticky=True)
 assert visible('Edit memory');assert visible(title);log('linked-reminder-save-returns-originating-memory')
 screenshot('android-reminder-return.png')
 a('shell','am','force-stop',bid);a('shell','monkey','-p',bid,'1')
 tap('Find a memory');fill('Search memories',title);tap('Open regular memory '+title);top();assert visible(space);assert visible(category);log('space-category-associations-survive-relaunch')
 screenshot('android-taxonomy-final.png')
 (out/'android-final-tree.xml').write_text(E.tostring(tree(),encoding='unicode'))
except Exception:
 (out/'android-failure-tree.xml').write_text(E.tostring(tree(),encoding='unicode'));screenshot('android-failure.png');raise
