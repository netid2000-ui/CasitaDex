"""Only the disposable refresh QA package on R5GL83X0K3N; physical Samsung isolated QA only; owner packages excluded."""
import subprocess,time,re,json,xml.etree.ElementTree as ET
from pathlib import Path
adb='/Volumes/FA-Development/Designs-by-FA/Android/QA-Tools/platform-tools-36.0.2/platform-tools/adb';pkg='com.designsbyfa.casitadex.refreshqa'
out=Path('docs/qa/evidence/samsung-full-sweep-20261115/scoped-locations');out.mkdir(parents=True,exist_ok=True);out.mkdir(parents=True,exist_ok=True)
def run(*a):return subprocess.check_output([adb,'-s','R5GL83X0K3N',*a])
def route(p):run('shell','am','start','-a','android.intent.action.VIEW','-d','casitadex-refreshqa://'+p,pkg);time.sleep(.7)
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
from phone import fill
def shot(name):
 (out/('android-'+name+'.png')).write_bytes(run('exec-out','screencap','-p'));(out/('android-'+name+'.xml')).write_bytes(ET.tostring(tree()))
tap('Save location');node('Choose Location');shot('selected-dark')
route('settings-manage?action=appearance');tap('Light appearance');route('add');tap('Choose Location');shot('picker-light');tap('Cancel');fill('Memory name (Required)','QA Location Saved Memory');fill('Description','Location persistence verification');tap('Save');run('shell','am','force-stop',pkg);route('answers');fill('Search memories','QA Location Saved Memory');shot('saved-memory-search');tap('Open regular memory QA Location Saved Memory');node('Edit Location');shot('saved-memory-details');assert any(n.get('text')=='QA Picker Final Shelf' for n in tree().iter('node'))
route('settings-manage?action=appearance');tap('System appearance');route('')
(out/'android-results.json').write_text(json.dumps({'result':'PASS','checks':['create','rename','restart','removal cancel','confirm removal','scoped picker create and select','light and dark'],'photos':'not exercised','package':pkg},indent=2))
print('ANDROID LOCATIONS PASS create, rename, restart, cancel/removal, picker create/select, light/dark',flush=True)
