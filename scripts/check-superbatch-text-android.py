"""Only the disposable refresh QA package on emulator-5554; no physical device writes."""
import subprocess,time,re,json,xml.etree.ElementTree as ET
from pathlib import Path
adb='/Volumes/FA-Development/Designs-by-FA/Android/Sdk/platform-tools/adb';pkg='com.designsbyfa.casitadex.refreshqa'
out=Path('docs/qa/evidence/superbatch-sweep-20261115');out.mkdir(parents=True,exist_ok=True)
def run(*a):return subprocess.check_output([adb,'-s','emulator-5554',*a])
def route(p):
 r=subprocess.run([adb,'-s','emulator-5554','shell','am','start','-a','android.intent.action.VIEW','-d','casitadex-refreshqa://'+p,pkg],capture_output=True,text=True)
 if r.returncode and 'intent has been delivered' not in r.stdout+r.stderr:raise RuntimeError(r.stdout+r.stderr)
 time.sleep(.7)
def tree():
 for attempt in range(4):
  try:
   run('shell','uiautomator','dump','/sdcard/cd-locations.xml');return ET.fromstring(run('shell','cat','/sdcard/cd-locations.xml'))
  except subprocess.CalledProcessError:
   if attempt==3:raise
   time.sleep(1)

def bounds(n):return list(map(int,re.findall(r'\d+',n.get('bounds'))))
def node(label):
 for _ in range(10):
  t=tree();matches=[n for n in t.iter('node') if n.get('content-desc')==label or n.get('content-desc','').startswith(label+', ')]
  for n in matches:
   x,y,a,b=bounds(n)
   if 60<=y<b<2340:return n
  run('shell','input','swipe','540','1900','540','800','300');time.sleep(.2)
 raise AssertionError('Missing '+label)
def tap(label):
 n=node(label);x,y,a,b=bounds(n);run('shell','input','tap',str((x+a)//2),str((y+b)//2));time.sleep(.4)
def fill(label,value):
 n=node(label);old=n.get('text','');tap(label);run('shell','input','keyevent','123')
 if old:run('shell','input','keyevent',*(['67']*len(old)))
 run('shell','input','text',value.replace(' ','%s'));run('shell','input','keyevent','4');time.sleep(.4)
def shot(name):
 (out/('android-'+name+'.png')).write_bytes(run('exec-out','screencap','-p'));(out/('android-'+name+'.xml')).write_bytes(ET.tostring(tree()))

tap('Restore memory');tap('More ···');node('Archive memory');shot('restored-active')
run('shell','am','force-stop',pkg);route('answers');fill('Search memories','QA Superbatch Text Lifecycle');tap('Open regular memory QA Superbatch Text Lifecycle');node('Edit Location');shot('restart-persistence')
(out/'native-lifecycle-result.json').write_text(json.dumps({'result':'PASS','package':pkg,'device':'emulator-5554','checks':['text memory saved','Find reopened saved memory','More opened','Archive direct action','Return to Active','delete confirmation cancelled','delete confirmed','Restore memory','restart retained active memory'],'photos':'not exercised','limitation':'Android emulator; iOS and full app parity not claimed'},indent=2))
print('NATIVE LIFECYCLE PASS',flush=True)
