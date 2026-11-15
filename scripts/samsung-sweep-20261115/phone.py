"""Samsung-only helpers. All writes target the isolated refreshqa package."""
import subprocess,time,re,shlex,json,xml.etree.ElementTree as ET
from pathlib import Path
adb='/Volumes/FA-Development/Designs-by-FA/Android/QA-Tools/platform-tools-36.0.2/platform-tools/adb'
serial='R5GL83X0K3N';pkg='com.designsbyfa.casitadex.refreshqa'
out=Path('docs/qa/evidence/samsung-full-sweep-20261115/extended');out.mkdir(parents=True,exist_ok=True)
def run(*a):return subprocess.check_output([adb,'-s',serial,*a],timeout=30)
def route(p):run('shell','am','start','-a','android.intent.action.VIEW','-d',shlex.quote('casitadex-refreshqa://'+p),pkg);time.sleep(1)
def tree():
 for attempt in range(3):
  try:
   run('shell','uiautomator','dump','/sdcard/cd-samsung.xml')
   return ET.fromstring(run('shell','cat','/sdcard/cd-samsung.xml'))
  except subprocess.CalledProcessError:
   if attempt==2:raise
def bounds(n):return list(map(int,re.findall(r'\d+',n.get('bounds'))))
def labels():return [(n.get('text'),n.get('content-desc')) for n in tree().iter('node') if n.get('text') or n.get('content-desc')]
def node(label,scroll=True):
 for _ in range(18 if scroll else 1):
  t=tree();parents={child:parent for parent in t.iter() for child in parent}
  candidates=[n for n in sorted(t.iter('node'),key=lambda n:n.get('clickable')!='true') if n.get('content-desc')==label or n.get('content-desc','').startswith(label+', ') or (not n.get('class','').endswith('EditText') and n.get('text','').casefold()==label.casefold())]
  for n in candidates:
   x,y,a,b=bounds(n)
   if 60<=y<b<2240:return n
  if not scroll:break
  target=candidates[0] if candidates else None;container=None;parent=target
  while parent is not None:
   parent=parents.get(parent)
   if parent is not None and parent.get('scrollable')=='true':container=parent;break
  if container is None:
   containers=[n for n in t.iter('node') if n.get('scrollable')=='true' and bounds(n)[3]>bounds(n)[1]]
   if containers:container=max(containers,key=lambda n:bounds(n)[3]-bounds(n)[1])
  x0,y0,x1,y1=bounds(container) if container is not None else [0,500,1080,1990]
  above=target is not None and bounds(target)[3]<=y0
  low=int(y0+(y1-y0)*.28);high=int(y0+(y1-y0)*.74);cx=str((x0+x1)//2)
  run('shell','input','swipe',cx,str(low if above else high),cx,str(high if above else low),'350')
 raise AssertionError('Missing '+label+' '+str(labels())[:4000])
def tap(label):
 n=node(label);x,y,a,b=bounds(n);run('shell','input','tap',str((x+a)//2),str((y+b)//2));time.sleep(.4);print('Tapped '+label,flush=True)
def hidekeyboard():
 status=run('shell','dumpsys','input_method').decode()
 if 'mInputShown=true' in status:
  run('shell','input','keyevent','4');time.sleep(.4)
def fill(label,value):
 hidekeyboard();n=node(label);old=n.get('text','');tap(label)
 focused=[n for n in tree().iter('node') if n.get('focused')=='true' and n.get('class','').endswith('EditText')]
 assert any(n.get('content-desc')==label for n in focused),('Wrong input focus',label)
 run('shell','input','keyevent','123')
 if old:run('shell','input','keyevent',*(['67']*len(old)))
 if value:run('shell','input','text',value.replace(' ','%s'))
 time.sleep(.3)
 hidekeyboard()
 assert node(label).get('text')==value,('Input mismatch',label,node(label).get('text'))
 print('Verified input '+label,flush=True)
def shot(name):
 (out/(name+'.xml')).write_bytes(ET.tostring(tree()));(out/(name+'.png')).write_bytes(run('exec-out','screencap','-p'))
def check(name,expected):
 ls=labels();assert all(any(x in pair for pair in ls) for x in expected),(name,ls);shot(name);print(name+' PASS',flush=True)
