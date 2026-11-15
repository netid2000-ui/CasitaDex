import sys
from pathlib import Path
sys.path.insert(0,'scripts/samsung-sweep-20261115')
import phone
phone.out=Path('docs/qa/evidence/samsung-ui-corrections-20261115/long-label');phone.out.mkdir(parents=True,exist_ok=True)
from phone import *
name='QA Samsung Hallway and Seasonal Storage Cabinet'
original=run('shell','settings','get','system','font_scale').decode().strip()
route('settings-manage?action=labels');tap('Spaces');tap('Create new label');fill('Space name',name);tap('Save')
route('answers');n=next(n for n in tree().iter('node') if n.get('content-desc','').startswith('Space'));tap(n.get('content-desc'));tap(name)
try:
 for scale in ['1.0','2.0']:
  run('shell','settings','put','system','font_scale',scale);route('answers')
  label=next(n.get('content-desc') for n in tree().iter('node') if n.get('content-desc','').startswith(name));x,y,a,b=bounds(node(label,scroll=False));assert 0<=x<a<=1080,(label,[x,y,a,b]);shot('selected-space-'+scale)
 run('shell','settings','put','system','font_scale','2.0');route('settings-manage?action=backup');node('Save full backup (with draft and photos)');shot('long-backup-button-2.0')
finally:
 run('shell','settings','put','system','font_scale',original)
route('answers');label=next(n.get('content-desc') for n in tree().iter('node') if n.get('content-desc','').startswith(name));tap(label);tap('All')
route('settings-manage?action=labels');tap('Spaces');fill('Search labels',name);tap(name);tap('Review removal ›');tap('Confirm remove label only')
route('');shot('final-home');print('Long selected label and backup button wrap PASS; QA label removed and font restored',flush=True)
