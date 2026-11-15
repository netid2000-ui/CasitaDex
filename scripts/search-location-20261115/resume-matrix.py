import os,sys,time,json,re
from pathlib import Path
sys.path.insert(0,'scripts/samsung-sweep-20261115')
import phone
phone.serial=os.environ.get('QA_SERIAL','emulator-5554')
phone.out=Path('docs/qa/evidence/search-location-20261115')/phone.serial
phone.out.mkdir(parents=True,exist_ok=True)
from phone import *
original_node=phone.node
def node(label,scroll=True):
 if label in ['Home','Photos','Reminders','Find']:
  for n in tree().iter('node'):
   if n.get('content-desc')==label and n.get('clickable')=='true':return n
 return original_node(label,scroll)
phone.node=node
checks=[]
def checkmark(name):
 shot(name);checks.append(name);(out/'results.json').write_text(json.dumps({'checks':checks},indent=2));print('PASS '+name,flush=True)
def blank():
 n=node('Search memories',False);assert n.get('text') in ('','Search memories…'),n.attrib
 assert not any(a=='Clear search' or b=='Clear search' for a,b in labels())
def nav():
 t=tree();ls=[n.get('content-desc') for n in t.iter('node') if n.get('content-desc') in ['Home','Photos','Reminders','Find']];assert ls==['Home','Photos','Reminders','Find'],ls

def geometry():
 width=int(run('shell','wm','size').decode().strip().split('x')[-2].split()[-1])
 for n in tree().iter('node'):
  if n.get('clickable')=='true' and n.get('package')==pkg:
   x,y,a,b=bounds(n)
   if b>y:assert 0<=x<a<=width,(n.attrib,width)

def pick(kind):
 tap(kind+'  ▾');t=tree();options=[n for n in t.iter('node') if n.get('clickable')=='true' and n.get('content-desc') not in ('','All','Done')]
 assert options,(kind,labels())
 label=options[0].get('content-desc');tap(label);return label
checks=json.loads((out/'results.json').read_text())['checks']
original=run('shell','settings','get','system','font_scale').decode().strip()
try:
 route('');tap('Find');tap('Next');run('shell','input','swipe','540','1100','540','1900','350');time.sleep(.5);shot('page-two-pager-revealed')
 tap('Previous');assert any(re.search(r'Page 1 of',a or '') for a,b in labels()),labels();checkmark('previous-page')
 for scale in ['1.0','2.0']:
  run('shell','settings','put','system','font_scale',scale);time.sleep(3)
  for theme in ['Light','Dark']:
   route('settings-manage?action=appearance');tap(theme+' appearance');tap('Home');geometry();checkmark(theme+'-'+scale+'-home')
   tap('Search Memories');blank();geometry();nav();checkmark(theme+'-'+scale+'-find')
   tap('Location  ▾');geometry();checkmark(theme+'-'+scale+'-location-options');tap('All')
finally:
 run('shell','settings','put','system','font_scale',original);time.sleep(3)
 route('settings-manage?action=appearance');tap('System appearance');tap('Home')
 (out/'restored-settings.json').write_text(json.dumps({'fontScale':run('shell','settings','get','system','font_scale').decode().strip(),'appearance':'System'},indent=2))
