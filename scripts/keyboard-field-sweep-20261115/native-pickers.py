source=open('scripts/keyboard-field-sweep-20261115/sweep.py').read();exec(source[:source.index("original=run('shell','settings'")])
original=run('shell','settings','get','system','font_scale').decode().strip()
try:
 for scale,theme in [('1.0','Light'),('2.0','Dark')]:
  if os.environ.get('QA_SCALE') and scale!=os.environ['QA_SCALE']:continue
  run('shell','settings','put','system','font_scale',scale);time.sleep(2);route('settings-manage?action=appearance');tap(theme+' appearance');route('reminders-manage?mode=new')
  t=tree();date=next(n.get('content-desc') for n in t.iter('node') if re.fullmatch(r'\d{4}-\d{2}-\d{2}',n.get('content-desc','')));tap(date);shot(scale+'-date-calendar');tap('CANCEL')
  label=next(n.get('content-desc') for n in tree().iter('node') if re.search(r'\d+:\d+',n.get('content-desc','')));tap(label);tap('Switch to text input mode for the time input.')
  for key in ['input_hour','input_minute']:
   n=next(n for n in tree().iter('node') if n.get('resource-id')=='android:id/'+key);before=n.get('text');x,y,a,b=bounds(n);run('shell','input','tap',str((x+a)//2),str((y+b)//2));time.sleep(1)
   frames=[tuple(map(int,f)) for f in re.findall(r'type=ime frame=\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]',run('shell','dumpsys','window').decode()) if int(f[3])>int(f[1])];assert frames
   n=next(n for n in tree().iter('node') if n.get('resource-id')=='android:id/'+key);assert n.get('focused')=='true';assert bounds(n)[3]<min(f[1] for f in frames);assert n.get('text')==before
   shot(scale+'-'+key);records.append({'case':key,'scale':scale,'fieldBounds':bounds(n),'keyboardFrames':frames,'status':'PASS'});save();hidekeyboard()
  tap('CANCEL');tap('Cancel')
finally:
 hidekeyboard();run('shell','settings','put','system','font_scale',original);route('settings-manage?action=appearance');tap('System appearance');route('')
print('COMPLETE native time inputs',flush=True)
