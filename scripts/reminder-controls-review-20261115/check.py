import os,re,json
source=open('scripts/keyboard-field-sweep-20261115/sweep.py').read();exec(source[:source.index("original=run('shell','settings'")])
original=run('shell','settings','get','system','font_scale').decode().strip()
results=[]
try:
 for scale,theme in [('1.0','Light'),('2.0','Dark')]:
  run('shell','settings','put','system','font_scale',scale);time.sleep(3);run('shell','am','force-stop',pkg);route('');time.sleep(7);route('settings-manage?action=appearance');time.sleep(2);tap(theme+' appearance');home();route('reminders');shot(scale+'-list')
  route('reminders-manage?mode=new');shot(scale+'-editor')
  t=tree();descs=[n.get('content-desc','') for n in t.iter('node')]
  date=next(x for x in descs if re.fullmatch(r'[0-9]{4}-[0-9]{2}-[0-9]{2}',x))
  clock=next(x for x in descs if re.fullmatch(r'[0-9]{1,2}:[0-9]{2}\s*[AP]M',x))
  for kind,label in [('date',date),('time',clock)]:
   tap(label);time.sleep(.5);shot(scale+'-'+kind+'-picker');t=tree()
   buttons={n.get('resource-id'):n for n in t.iter('node') if n.get('resource-id') in ['android:id/button1','android:id/button2']}
   assert set(buttons)=={'android:id/button1','android:id/button2'},[(n.get('resource-id'),n.get('text')) for n in t.iter('node')]
   for n in buttons.values():
    x,y,a,b=bounds(n);assert x>=0 and a<=1080 and y>=0 and b<=2340 and b>y
   n=buttons['android:id/button2'];x,y,a,b=bounds(n);run('shell','input','tap',str((x+a)//2),str((y+b)//2));time.sleep(.5)
   node(label);results.append({'scale':scale,'theme':theme,'picker':kind,'opens':True,'actionsVisible':True,'cancelPreservesValue':True});print('PASS',results[-1],flush=True)
  tap('Cancel');home()
finally:
 run('shell','settings','put','system','font_scale',original);time.sleep(3);run('shell','am','force-stop',pkg);route('');time.sleep(7);route('settings-manage?action=appearance');time.sleep(2);tap('System appearance');home()
(out/'reminder-results.json').write_text(json.dumps(results,indent=2))
print('COMPLETE',len(results),flush=True)
