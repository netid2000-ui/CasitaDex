from pathlib import Path
import subprocess,xml.etree.ElementTree as E,re,json,time,hashlib
b=Path('/Volumes/FA-Development/Designs-by-FA');out=b/'QA-Evidence/CasitaDex/sb40-photo-workspace-20261108';adb=str(b/'Android/Sdk/platform-tools/adb');app='com.designsbyfa.casitadex.sb40qa'
def a(*args):return subprocess.check_output([adb,'-s','emulator-5554',*args],text=True)
def tree():
 a('shell','uiautomator','dump','/sdcard/photo-find.xml');return E.fromstring(a('shell','cat','/sdcard/photo-find.xml'))
def nodes(label):return [n for n in tree().iter('node') if n.get('text')==label or n.get('content-desc')==label]
def tap(label):
 n=nodes(label)[0];v=list(map(int,re.findall(r'-?\d+',n.get('bounds'))));a('shell','input','tap',str((v[0]+v[2])//2),str((v[1]+v[3])//2));time.sleep(.4)
def fill(value):
 n=next(n for n in tree().iter('node') if n.get('class')=='android.widget.EditText' and n.get('content-desc')=='Search memories');v=list(map(int,re.findall(r'\d+',n.get('bounds'))));a('shell','input','tap',str((v[0]+v[2])//2),str((v[1]+v[3])//2));time.sleep(.3);a('shell','input','keyevent','123');a('shell','input','keyevent',*(['67']*len(n.get('text',''))));time.sleep(.4);clear=next(n for n in tree().iter('node') if n.get('class')=='android.widget.EditText');assert not clear.get('text') or clear.get('text')==clear.get('hint');a('shell','input','text',value.replace(' ','%s'));a('shell','input','keyevent','66');time.sleep(.4);exact=next(n for n in tree().iter('node') if n.get('class')=='android.widget.EditText');assert exact.get('text')==value
package=a('shell','pm','path',app).strip()[8:];assert a('shell','sha256sum',package).split()[0]==hashlib.sha256((out/'photos-delivered-qa.apk').read_bytes()).hexdigest()
try:
 fill('SB40 Photo Workspace Acceptance');assert nodes('Open photo memory SB40 Photo Workspace Acceptance');tap('With photos only');fill('SB40 Parity shared-journey-v3-20261108');assert nodes('Open regular memory SB40 Parity shared-journey-v3-20261108');tap('With photos only');assert nodes('0 memories found');tap('With photos only');assert nodes('Open regular memory SB40 Parity shared-journey-v3-20261108');fill('SB40 Photo Workspace Acceptance');tap('With photos only');assert nodes('Open photo memory SB40 Photo Workspace Acceptance');row={'case':'find-photo-filter-composes-with-exact-search','status':'PASS'};print(json.dumps(row));(out/'android-find-journal.json').write_text(json.dumps(row,indent=2));
 with (out/'android-find-with-photos.png').open('wb') as f:subprocess.run([adb,'-s','emulator-5554','exec-out','screencap','-p'],stdout=f,check=True)
except:
 (out/'android-find-failure.xml').write_text(E.tostring(tree(),encoding='unicode'));raise
