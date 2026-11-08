from pathlib import Path
import subprocess,xml.etree.ElementTree as E,re,json,time,hashlib
b=Path('/Volumes/FA-Development/Designs-by-FA');out=b/'QA-Evidence/CasitaDex/sb40-photo-workspace-20261108';adb=str(b/'Android/Sdk/platform-tools/adb');app='com.designsbyfa.casitadex.sb40qa'
def a(*args):return subprocess.check_output([adb,'-s','emulator-5554',*args],text=True)
def tree():
 a('shell','uiautomator','dump','/sdcard/photo-final.xml');return E.fromstring(a('shell','cat','/sdcard/photo-final.xml'))
def nodes(label):return [n for n in tree().iter('node') if n.get('text')==label or n.get('content-desc')==label]
def tap(label):
 n=nodes(label)[0];v=list(map(int,re.findall(r'-?\d+',n.get('bounds'))));a('shell','input','tap',str((v[0]+v[2])//2),str((v[1]+v[3])//2));time.sleep(.6)
def shot(name):
 with (out/(name+'.png')).open('wb') as f:subprocess.run([adb,'-s','emulator-5554','exec-out','screencap','-p'],stdout=f,check=True)
def fill(value):
 n=next(n for n in tree().iter('node') if n.get('class')=='android.widget.EditText' and n.get('content-desc')=='Search memories');v=list(map(int,re.findall(r'\d+',n.get('bounds'))));a('shell','input','tap',str((v[0]+v[2])//2),str((v[1]+v[3])//2));time.sleep(.3);a('shell','input','keyevent','123')
 if n.get('text'):a('shell','input','keyevent',*(['67']*len(n.get('text',''))))
 a('shell','input','text',value.replace(' ','%s'));a('shell','input','keyevent','66');time.sleep(.5)
package=a('shell','pm','path',app).strip()[8:];assert a('shell','sha256sum',package).split()[0]==hashlib.sha256((out/'photos-delivered-qa.apk').read_bytes()).hexdigest()
try:
 tap('CasitaDex logo, go to Home');tap('Find a memory');fill('SB40 Photo Workspace Acceptance');tap('Open photo memory SB40 Photo Workspace Acceptance')
 for i in range(8):
  if nodes('Open photo 1 of SB40 Photo Workspace Acceptance'):
   v=list(map(int,re.findall(r'-?\d+',nodes('Open photo 1 of SB40 Photo Workspace Acceptance')[0].get('bounds'))))
   if v[3]>v[1] and v[1]>730 and v[3]<2100:break
  a('shell','input','swipe','500','1700','500','900','400')
 tap('Open photo 1 of SB40 Photo Workspace Acceptance');tap('Reset photo zoom');shot('android-delivered-zoom-original');tap('Zoom photo in');shot('android-delivered-zoom-plus');tap('Reset photo zoom');shot('android-delivered-zoom-reset')
 a('shell','input','tap','540','900');a('shell','input','tap','540','900');time.sleep(.6);shot('android-delivered-zoom-double');a('shell','input','swipe','540','900','700','900','500');shot('android-delivered-zoom-pan');tap('Reset photo zoom');tap('Close photo');shot('android-delivered-details')
 (out/'android-delivered-ui.json').write_text(json.dumps({'status':'COMMANDS_COMPLETED','visualZoom':'PENDING_PIXEL_COMPARISON'},indent=2))
 print('ANDROID_VIEWER_COMMANDS_COMPLETED')
except:
 (out/'android-delivered-failure.xml').write_text(E.tostring(tree(),encoding='unicode'));shot('android-delivered-failure');raise
