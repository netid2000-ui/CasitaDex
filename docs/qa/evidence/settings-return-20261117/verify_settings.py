import phone as p,sys,time,json
p.serial=sys.argv[1];p.out=p.Path(sys.argv[2]);p.out.mkdir(exist_ok=True)
font=p.run('shell','settings','get','system','font_scale').decode().strip();night='yes' if 'yes' in p.run('shell','cmd','uimode','night').decode() else 'no';passed=[]
try:
 for mode,scale in [('no','1.0'),('yes','2.0')]:
  name=mode+'-'+scale;p.run('shell','cmd','uimode','night',mode);p.run('shell','settings','put','system','font_scale',scale);time.sleep(2)
  p.route('more');p.tap('Archived Memories');p.node('‹ Settings');p.shot(name+'-archived');p.tap('‹ Settings');p.node('Archived Memories');p.required_class='android.widget.Button';p.tap('Reminders');p.required_class=None;p.node('‹ Settings');p.shot(name+'-reminders');p.tap('Add Reminder ›');p.tap('Cancel');p.node('‹ Settings');p.tap('‹ Settings');p.node('Archived Memories')
  p.tap('Archived Memories');p.tap('Find');assert not any('‹ Settings' in pair for pair in p.labels());p.tap('Reminders');assert not any('‹ Settings' in pair for pair in p.labels());p.shot(name+'-direct-tab');passed.append(name);print('PASS '+name+' archive/reminders return, editor Cancel, direct tabs',flush=True)
finally:
 p.run('shell','cmd','uimode','night',night);p.run('shell','settings','put','system','font_scale',font);p.run('shell','am','start','-S','-n',p.pkg+'/.MainActivity');(p.out/'results.json').write_text(json.dumps({'passed':passed,'fontRestored':font,'nightRestored':night},indent=2))
