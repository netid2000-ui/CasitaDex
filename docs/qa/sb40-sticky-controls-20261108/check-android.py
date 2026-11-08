from pathlib import Path
import subprocess,xml.etree.ElementTree as E,re,json,time
out=Path(__file__).parent;adb='/Volumes/FA-Development/Designs-by-FA/Android/Sdk/platform-tools/adb'
def a(*args):return subprocess.check_output([adb,'-s','emulator-5554',*args],text=True)
def tree():
 a('shell','uiautomator','dump','/sdcard/sb40-sticky.xml');return list(E.fromstring(a('shell','cat','/sdcard/sb40-sticky.xml')).iter('node'))
def node(ns,label):return next(n for n in ns if n.get('content-desc')==label or n.get('text')==label)
def tap(label):
 n=node(tree(),label);v=list(map(int,re.findall(r'\d+',n.get('bounds'))));a('shell','input','tap',str((v[0]+v[2])//2),str((v[1]+v[3])//2));time.sleep(.5)
def shot(name):
 with (out/(name+'.png')).open('wb') as f:subprocess.run([adb,'-s','emulator-5554','exec-out','screencap','-p'],stdout=f,check=True)
try:
 tap('CasitaDex logo, go to Home');tap('Photos');tap('Grid photo view');before=tree();shot('android-photos-before');a('shell','input','swipe','540','1900','540','1100','500');after=tree()
 for label in ['Add Photo Memory','Grid photo view','Compact photo view','Recently updated','Recently added']:assert node(before,label).get('bounds')==node(after,label).get('bounds'),label
 photos=[n for n in before if n.get('content-desc','').startswith('View photo 1 of ')];assert photos;old=photos[0];matches=[n for n in after if n.get('content-desc')==old.get('content-desc')];assert not matches or matches[0].get('bounds')!=old.get('bounds'),'Gallery did not move';shot('android-photos-scrolled');tap('Compact photo view');tap('Recently added');tap('Recently updated');tap('Grid photo view');tap('CasitaDex logo, go to Home');tap('Find a memory');node(tree(),'With photos only');shot('android-find');tap('With photos only');assert node(tree(),'With photos only').get('selected')=='true';tap('With photos only');(out/'android-report.json').write_text(json.dumps({'status':'PASS','checks':['sticky controls while gallery moves','view and sort actions','With photos only label and toggle']},indent=2));print('ANDROID_PASS')
except Exception as e:
 shot('android-failure');(out/'android-report.json').write_text(json.dumps({'status':'FAIL','error':str(e)},indent=2));raise
