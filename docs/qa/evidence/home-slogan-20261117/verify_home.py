import phone as p,sys,time,json
p.serial=sys.argv[1];p.out=p.Path(sys.argv[2]);p.out.mkdir(exist_ok=True)
font=p.run('shell','settings','get','system','font_scale').decode().strip();night='yes' if 'yes' in p.run('shell','cmd','uimode','night').decode() else 'no'
passed=[]
try:
 for mode,scale in [('no','1.0'),('yes','1.0'),('yes','2.0')]:
  p.run('shell','cmd','uimode','night',mode);p.run('shell','settings','put','system','font_scale',scale);p.run('shell','am','start','-S','-n',p.pkg+'/.MainActivity');time.sleep(2);p.tap('Home')
  n=p.node('Your little home\nfor what you want to remember.')
  nav=p.bounds(p.node('Home'))[1]
  if scale=='2.0' or p.bounds(n)[3]>=nav:
   p.run('shell','input','swipe','500',str(nav-100),'500','450','400');time.sleep(1);n=p.node('Your little home\nfor what you want to remember.')
  assert p.bounds(n)[3]<nav, 'Slogan overlaps bottom navigation'
  p.shot(mode+'-'+scale);passed.append(mode+'-'+scale);print('PASS',passed[-1],flush=True)
finally:
 p.run('shell','cmd','uimode','night',night);p.run('shell','settings','put','system','font_scale',font);p.run('shell','am','start','-S','-n',p.pkg+'/.MainActivity');(p.out/'results.json').write_text(json.dumps(dict(passed=passed,fontRestored=font,nightRestored=night),indent=2))
