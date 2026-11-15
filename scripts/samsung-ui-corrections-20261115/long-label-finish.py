import sys
from pathlib import Path
sys.path.insert(0,'scripts/samsung-sweep-20261115')
import phone
phone.out=Path('docs/qa/evidence/samsung-ui-corrections-20261115/long-label');phone.out.mkdir(parents=True,exist_ok=True)
from phone import *
name='QA Samsung Hallway and Seasonal Storage Cabinet'
original=run('shell','settings','get','system','font_scale').decode().strip()
try:
 for scale in ['1.0','2.0']:
  run('shell','settings','put','system','font_scale',scale);time.sleep(2);route('answers');tap('Find')
  label=next(n.get('content-desc') for n in tree().iter('node') if n.get('content-desc','').startswith(name) or n.get('content-desc','').startswith('Space'))
  tap(label);tap(name)
  label=next(n.get('content-desc') for n in tree().iter('node') if n.get('content-desc','').startswith(name));x,y,a,b=bounds(node(label,scroll=False));assert 0<=x<a<=1080,(label,[x,y,a,b]);shot('selected-space-'+scale)
 route('settings-manage?action=backup');node('Save full backup (with draft and photos)');shot('long-backup-button-2.0')
finally:
 run('shell','settings','put','system','font_scale',original);time.sleep(2)
route('answers');tap('Find');label=next(n.get('content-desc') for n in tree().iter('node') if n.get('content-desc','').startswith(name) or n.get('content-desc','').startswith('Space'));tap(label);tap('All')
route('settings-manage?action=labels');tap('Spaces');fill('Search labels',name);tap(name);tap('Review removal ›');tap('Confirm remove label only')
route('');shot('final-home');print('Long selected label and backup button wrap PASS; QA label removed and font restored',flush=True)
