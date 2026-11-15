import os,sys,time,json
from pathlib import Path
sys.path.insert(0,'scripts/samsung-sweep-20261115')
import phone
phone.serial=os.environ['QA_SERIAL'];phone.out=Path('docs/qa/evidence/photo-source-cancel-20261115')/phone.serial;phone.out.mkdir(parents=True,exist_ok=True)
from phone import *
def values():
 return [(n.get('content-desc'),n.get('text')) for n in tree().iter('node') if n.get('class','').endswith('EditText')]
def choose_and_cancel(name,back=False):
 before=values();shot(name+'-draft-before');tap('+ Add Photo')
 for label in ['Take Photo','Choose from Library','Browse Files','Cancel']:node(label,False)
 n=node('Cancel',False);x,y,a,b=bounds(n);assert a>x and b>y
 shot(name+'-chooser')
 if back:run('shell','input','keyevent','4');time.sleep(.5)
 else:tap('Cancel')
 assert not any(a=='Choose a source for your photo or image.' for a,b in labels())
 assert values()==before,(before,values())
 shot(name+'-draft-after');print('PASS '+name+' preserves draft fields',flush=True)
original=run('shell','settings','get','system','font_scale').decode().strip()
try:
 route('add?mode=photo');choose_and_cancel('cancel');choose_and_cancel('android-back',True)
 run('shell','settings','put','system','font_scale','2.0');time.sleep(3);route('add?mode=photo');choose_and_cancel('large-text-cancel')
finally:
 run('shell','settings','put','system','font_scale',original);time.sleep(3);route('add?mode=photo')
 (out/'settings.json').write_text(json.dumps({'restoredFontScale':original}))
