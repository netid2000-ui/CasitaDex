import sys
from pathlib import Path
sys.path.insert(0,'scripts/samsung-sweep-20261115')
import phone
phone.out=Path('docs/qa/evidence/samsung-ui-corrections-20261115/photo-position-final');phone.out.mkdir(parents=True,exist_ok=True)
from phone import *
results=[]
for theme in ['Light','Dark']:
 route('settings-manage?action=appearance');tap(theme+' appearance');route('photos');run('shell','input','swipe','540','1700','540','1200','300');time.sleep(1)
 candidates=[n for n in tree().iter('node') if n.get('content-desc','').startswith('View photo 1 of') and n.get('clickable')=='true' and bounds(n)[3]-bounds(n)[1]>=180]
 assert candidates
 n=max(candidates,key=lambda n:bounds(n)[3]-bounds(n)[1]);label=n.get('content-desc');before=bounds(n);shot(theme+'-before');tap(label);tap('Zoom photo in');tap('Reset photo zoom');tap('Close photo');after=bounds(node(label));assert before==after,(before,after);shot(theme+'-after');results.append({'theme':theme,'label':label,'before':before,'after':after});print(theme+' fully visible photo position PASS',flush=True)
route('settings-manage?action=appearance');tap('System appearance');route('');(out/'results.json').write_text(json.dumps(results,indent=2)+'\n')
