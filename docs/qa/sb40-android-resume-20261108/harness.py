from pathlib import Path
import subprocess,xml.etree.ElementTree as E,re,time,json,importlib.util
out=Path(__file__).parent;repo=Path('/Volumes/FA-Development/Designs-by-FA/Development/CasitaDex/sb40-authority-source-20261108')
s=importlib.util.spec_from_file_location('parity',repo/'scripts/parity/run-parity.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
identity=m.gate('android',m.CONFIG['targets']['android']);(out/'identity.json').write_text(json.dumps(identity,indent=2));adb=m.ADB

def a(*args):return subprocess.check_output([adb,'-s','emulator-5554',*args],text=True)
def tree():
 a('shell','uiautomator','dump','/sdcard/sb40-resume.xml');return list(E.fromstring(a('shell','cat','/sdcard/sb40-resume.xml')).iter('node'))
def match(ns,label,kind=None):return [n for n in ns if (n.get('text')==label or n.get('content-desc')==label) and (kind is None or n.get('class','').endswith(kind))]
def box(n):return list(map(int,re.findall(r'-?\d+',n.get('bounds'))))
def tap(label,kind=None):
 ns=match(tree(),label,kind);ns=[n for n in ns if box(n)[3]>box(n)[1] and 70<=sum(box(n)[1::2])//2<=2330];assert ns,('No actionable node',label)
 n=next((x for x in ns if x.get('clickable')=='true'),ns[0]);x,y,z,w=box(n);a('shell','input','tap',str((x+z)//2),str((y+w)//2));time.sleep(.4)
def swipe(up=True):a('shell','input','swipe','540','1900' if up else '850','540','950' if up else '1850','400')
def reach(label,kind=None):
 for _ in range(10):
  nodes=match(tree(),label,kind)
  if any(box(n)[3]>box(n)[1] and 700<=sum(box(n)[1::2])//2<=2050 for n in nodes):return
  swipe(not nodes or max(box(n)[3] for n in nodes)>2050)
 raise RuntimeError('Cannot reach '+label)
def capture(name):
 a('shell','uiautomator','dump','/sdcard/sb40-resume.xml');(out/(name+'.xml')).write_text(a('shell','cat','/sdcard/sb40-resume.xml'))
 with (out/(name+'.png')).open('wb') as f:subprocess.run([adb,'-s','emulator-5554','exec-out','screencap','-p'],stdout=f,check=True)
def labels():return [(n.get('text') or n.get('content-desc'),n.get('class'),n.get('bounds'),n.get('enabled')) for n in tree() if n.get('text') or n.get('content-desc')]

def control(label):
 for _ in range(10):
  ns=match(tree(),label,'Button')
  if ns:
   x,y,z,w=box(ns[0])
   if w-y>=100 and 1680<=(y+w)//2<=2250:tap(label,'Button');return
  a('shell','input','swipe','540','2220','540','1750','500')
 raise RuntimeError('Cannot reach '+label)
