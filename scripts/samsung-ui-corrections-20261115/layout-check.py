import sys,os,json,re
from pathlib import Path
sys.path.insert(0,'scripts/samsung-sweep-20261115')
import phone
phone.serial=os.environ.get('QA_SERIAL','R5GL83X0K3N')
phone.out=Path('docs/qa/evidence/samsung-ui-corrections-20261115')/phone.serial
phone.out.mkdir(parents=True,exist_ok=True)
from phone import *
results=[]
def visible_button(label):
 n=node(label,scroll=False);x,y,a,b=bounds(n)
 width=int(run('shell','wm','size').decode().split('x')[-2].split()[-1]);assert 0<=x<a<=width,(label,bounds(n),width)
 return n
def controls(name,prefixes):
 t=tree()
 for prefix in prefixes:
  n=next(n for n in t.iter('node') if n.get('content-desc','').startswith(prefix))
  visible_button(n.get('content-desc'))
 assert not any('Edit ✎' in (a or '') for a,b in labels())
 shot(name);results.append(name);print(name+' PASS',flush=True)
original=run('shell','settings','get','system','font_scale').decode().strip()
try:
 for scale in (['1.0'] if os.environ.get('QA_SMOKE') else ['1.0','2.0']):
  run('shell','settings','put','system','font_scale',scale)
  for theme in (['Light'] if os.environ.get('QA_SMOKE') else ['Light','Dark']):
   route('settings-manage?action=appearance');tap(theme+' appearance')
   route('answers');controls(theme+'-'+scale+'-find',['Space','Category','With photos only'])
   route('reminders');controls(theme+'-'+scale+'-reminders',['Upcoming (','Overdue (','Completed (','Memory dates ('])
   route('photos');controls(theme+'-'+scale+'-photos',['Grid photo view','Compact photo view','Sort photos','Add Photo Memory'])
   density=int(re.findall(r'(?:Physical|Override) density: (\d+)',run('shell','wm','density').decode())[-1])/160
   for label in ['Grid photo view','Compact photo view','Sort photos','Add Photo Memory']:
    x,y,a,b=bounds(node(label));assert (b-y)/density>=47.8,(label,(b-y)/density)
   route('card?id=sb26qa_007');controls(theme+'-'+scale+'-details-top',['Edit memory','Edit name'])
   for label in ['Edit Space','Edit Categories','Edit Reference']:
    node(label);shot(theme+'-'+scale+'-'+label.replace(' ','-'));assert all('Edit ✎' not in (a or '') for a,b in labels())
   tap('Edit Reference');node('Reference');shot(theme+'-'+scale+'-reference-editor')
   route('card?id=sb26qa_007')
finally:
 run('shell','settings','put','system','font_scale',original)
 route('settings-manage?action=appearance');tap('System appearance');route('')
(out/'layout-results.json').write_text(json.dumps({'checks':results,'fontScaleRestored':original},indent=2)+'\n')
print('Layout geometry, contextual Edit controls and 48dp photo targets PASS',flush=True)
