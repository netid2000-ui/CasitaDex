import subprocess,time,re,json,xml.etree.ElementTree as ET
from pathlib import Path
adb='/Volumes/FA-Development/Designs-by-FA/Android/QA-Tools/platform-tools-36.0.2/platform-tools/adb'
out=Path('docs/qa/evidence/samsung-full-sweep-20261115/six-part-navigation');out.mkdir(parents=True,exist_ok=True)
def run(*args):return subprocess.check_output([adb,'-s','R5GL83X0K3N',*args])
def openroute(route):run('shell','am','start','-a','android.intent.action.VIEW','-d','casitadex-refreshqa://'+route,'com.designsbyfa.casitadex.refreshqa');time.sleep(1)
def tree():
 run('shell','uiautomator','dump','/sdcard/cd-refresh.xml');return ET.fromstring(run('shell','cat','/sdcard/cd-refresh.xml'))
def tap(label):
 t=tree();n=next(n for n in t.iter('node') if n.get('content-desc')==label and n.get('clickable')=='true');x1,y1,x2,y2=map(int,re.findall(r'\d+',n.get('bounds')));run('shell','input','tap',str((x1+x2)//2),str((y1+y2)//2));time.sleep(.5)
def capture(name,required):
 t=tree();labels={n.get('content-desc') for n in t.iter('node')}|{n.get('text') for n in t.iter('node')};assert set(required)<=labels,(name,set(required)-labels)
 (out/('android-'+name+'.xml')).write_bytes(ET.tostring(t));(out/('android-'+name+'.png')).write_bytes(run('exec-out','screencap','-p'));print(name,'PASS',flush=True)
openroute('settings-manage?action=appearance');tap('Dark appearance')
openroute('settings-manage?action=storage');tap('Measure device storage');capture('Dark-storage',['Measure device storage'])
openroute('settings-manage?action=appearance');tap('System appearance');openroute('')
print('Interrupted final check rerun PASS; System restored',flush=True)
