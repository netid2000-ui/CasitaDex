import subprocess,time,re,json,xml.etree.ElementTree as ET
from pathlib import Path
adb='/Volumes/FA-Development/Designs-by-FA/Android/Sdk/platform-tools/adb'
out=Path('docs/qa/evidence/six-part-final-20261115')
def run(*args):return subprocess.check_output([adb,'-s','emulator-5554',*args])
def openroute(route):run('shell','am','start','-a','android.intent.action.VIEW','-d','casitadex-refreshqa://'+route,'com.designsbyfa.casitadex.refreshqa');time.sleep(1)
def tree():
 run('shell','uiautomator','dump','/sdcard/cd-refresh.xml');return ET.fromstring(run('shell','cat','/sdcard/cd-refresh.xml'))
def tap(label):
 t=tree();n=next(n for n in t.iter('node') if n.get('content-desc')==label and n.get('clickable')=='true');x1,y1,x2,y2=map(int,re.findall(r'\d+',n.get('bounds')));run('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2));time.sleep(.5)
def capture(name,required):
 t=tree();labels={n.get('content-desc') for n in t.iter('node')}|{n.get('text') for n in t.iter('node')};assert set(required)<=labels,(name,set(required)-labels)
 (out/('android-'+name+'.xml')).write_bytes(ET.tostring(t));(out/('android-'+name+'.png')).write_bytes(run('exec-out','screencap','-p'));print(name,'PASS',flush=True)
for theme in ['Light','Dark']:
 openroute('settings-manage?action=appearance');tap(theme+' appearance')
 for route,name,labels in [('', 'home',['Home','Photos','Reminders','Find','Find a memory']),('answers','find',['With photos only']),('photos','photos',['Add Photo Memory','Sort photos, Recently updated']),('more','settings',['Appearance']),('settings-manage?action=storage','storage',['Measure device storage'])]:
  openroute(route)
  if name=='storage':tap('Measure device storage')
  capture(theme+'-'+name,labels)
openroute('settings-manage?action=appearance');tap('System appearance');openroute('')
print('10 Android screen checks PASS; System appearance restored; isolated synthetic QA only',flush=True)
