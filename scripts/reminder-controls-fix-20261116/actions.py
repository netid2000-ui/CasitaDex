import os,json
source=open('scripts/keyboard-field-sweep-20261115/sweep.py').read();exec(source[:source.index("original=run('shell','settings'")])
original=run('shell','settings','get','system','font_scale').decode().strip()
results=[]
try:
 for scale,theme in [('1.0','Light'),('2.0','Dark')]:
  run('shell','settings','put','system','font_scale',scale);time.sleep(3);run('shell','am','force-stop',pkg);route('');time.sleep(7);route('settings-manage?action=appearance');time.sleep(2);tap(theme+' appearance');home();route('reminders')
  t=tree();tabs=[n.get('content-desc') for n in t.iter('node') if n.get('content-desc','').startswith(('Upcoming (','Overdue (','Completed (','Memory dates ('))];print('COUNTS',tabs,flush=True)
  overdue=next(x for x in tabs if x.startswith('Overdue ('))
  if overdue=='Overdue (0)':
   results.append({'scale':scale,'theme':theme,'counts':tabs,'status':'SKIP','reason':'No overdue reminders; existing data preserved'});continue
  tap(overdue);tap('More ···');shot(scale+'-expanded')
  for label in ['Complete','Edit ›','Delete','Less ↑']:
   n=node(label);x,y,a,b=bounds(n);assert x>=0 and a<=1080 and b>y,(label,[x,y,a,b])
  tap('Edit ›');node('Save Reminder');shot(scale+'-edit');tap('Cancel');home()
  results.append({'scale':scale,'theme':theme,'counts':tabs,'actionsFit':True,'editOpens':True,'cancelReturns':True})
finally:
 run('shell','settings','put','system','font_scale',original);time.sleep(3);run('shell','am','force-stop',pkg);route('');time.sleep(7);route('settings-manage?action=appearance');time.sleep(2);tap('System appearance');home()
(out/'actions-results.json').write_text(json.dumps(results,indent=2));print('COMPLETE',len(results),flush=True)
