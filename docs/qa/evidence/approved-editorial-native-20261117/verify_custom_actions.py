import phone as p,sys,time,json
p.serial=sys.argv[1];p.out=p.Path(sys.argv[2]);p.out.mkdir(exist_ok=True)
font=p.run('shell','settings','get','system','font_scale').decode().strip();night='yes' if 'yes' in p.run('shell','cmd','uimode','night').decode() else 'no';results=[]
try:
 for mode,scale in [('no','1.0'),('yes','1.0'),('no','2.0'),('yes','2.0')]:
  name=('dark' if mode=='yes' else 'light')+'-'+scale
  p.run('shell','cmd','uimode','night',mode);p.run('shell','settings','put','system','font_scale',scale);time.sleep(2)
  p.route('answers');p.tap('Photos');p.node('Grid photo view');p.tap('Compact photo view');p.tap('Grid photo view');p.shot(name+'-photos-final');p.tap('Sort photos');p.node('Cancel');p.tap('Cancel');p.tap('Reminders');p.shot(name+'-reminders-final')
  for title in ['Overdue','Completed','Memory dates','Upcoming']:
   ns=[n for n in p.tree().iter('node') if n.get('content-desc','').startswith(title+' (')];assert ns,title;n=ns[0];x,y,a,b=p.bounds(n);p.run('shell','input','tap',str((x+a)//2),str((y+b)//2));time.sleep(.5)
  results.append(name);print('PASS '+name,flush=True)
finally:
 p.run('shell','cmd','uimode','night',night);p.run('shell','settings','put','system','font_scale',font);p.run('shell','am','start','-S','-n',p.pkg+'/.MainActivity');(p.out/'custom-results.json').write_text(json.dumps({'passed':results,'restoredFont':font,'restoredNight':night},indent=2))
