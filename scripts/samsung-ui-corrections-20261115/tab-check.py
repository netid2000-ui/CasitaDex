import sys,os
from pathlib import Path
sys.path.insert(0,'scripts/samsung-sweep-20261115')
import phone
phone.serial=os.environ.get('QA_SERIAL','R5GL83X0K3N');phone.out=Path('docs/qa/evidence/samsung-ui-corrections-20261115')/(phone.serial+'-final-tabs');phone.out.mkdir(parents=True,exist_ok=True)
from phone import *
original=run('shell','settings','get','system','font_scale').decode().strip();results=[]
try:
 for theme in (['Light'] if os.environ.get('QA_SMOKE') else ['Light','Dark']):
  route('settings-manage?action=appearance');tap(theme+' appearance')
  for scale in ['1.0','2.0']:
   run('shell','settings','put','system','font_scale',scale);time.sleep(2);route('reminders');tap('Reminders');t=tree();rows={}
   for prefix in ['Upcoming (','Overdue (','Completed (','Memory dates (']:
    n=next(n for n in t.iter('node') if n.get('content-desc','').startswith(prefix));x,y,a,b=bounds(n);assert 0<=x<a<=1080;rows.setdefault(y,[]).append(b-y)
   assert all(max(heights)-min(heights)<=1 for heights in rows.values()),rows
   shot(theme+'-'+scale);results.append({'theme':theme,'fontScale':scale,'rowHeights':rows});print(theme+' '+scale+' aligned tabs PASS',flush=True)
finally:
 run('shell','settings','put','system','font_scale',original);route('settings-manage?action=appearance');tap('System appearance');route('')
(out/'results.json').write_text(json.dumps(results,indent=2)+'\n')
