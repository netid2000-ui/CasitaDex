import sys,time,re,json
from pathlib import Path
import phone
phone.serial=sys.argv[1];phone.out=Path(sys.argv[2]);phone.out.mkdir(exist_ok=True)
from phone import *
original=run('shell','settings','get','system','font_scale').decode().strip();night=run('shell','cmd','uimode','night').decode().strip();originalNight='yes' if 'yes' in night else 'no'
results=[]
def content():return [x for pair in labels() for x in pair if x]
def bounded(label):
 n=node(label);x,y,a,b=bounds(n);width=int(run('shell','wm','size').decode().strip().split(': ')[-1].split('x')[0]);assert 0<=x<a<=width,(label,(x,y,a,b));return n
try:
 for mode,scale in [('no','1.0'),('yes','1.0'),('no','2.0'),('yes','2.0')]:
  name=('dark' if mode=='yes' else 'light')+'-'+scale
  run('shell','cmd','uimode','night',mode);run('shell','settings','put','system','font_scale',scale);time.sleep(2)
  route('answers');tap('Home');bounded('Search Memories');bounded('Add Memory');node('A place for everything you want to remember.');shot(name+'-home')
  nav=[n.get('content-desc') for n in tree().iter('node') if n.get('package')==pkg and n.get('content-desc') in ['Home','Photos','Reminders','Find']];assert nav==['Home','Photos','Reminders','Find'],nav
  route('answers');node('Location  ▾');shot(name+'-find')
  route('add');node('Choose Space');shot(name+'-add')
  for label in ['Choose Space','Choose Categories','Choose Location']:
   tap(label);node('Cancel');shot(name+'-'+label.replace(' ','-'));tap('Cancel')
  tap('+ Add Photo')
  for label in ['Take Photo','Choose from Library','Browse Files','Cancel']:bounded(label)
  shot(name+'-photo-chooser');tap('Cancel');assert 'Choose from Library' not in content()
  route('reminders-manage?mode=new&origin=home');node('Reminder title (Required)');shot(name+'-reminder')
  date=next(n.get('content-desc') for n in tree().iter('node') if re.fullmatch(r'\d{4}-\d{2}-\d{2}',n.get('content-desc','')))
  tap(date);node('CANCEL',False);shot(name+'-date-picker');run('shell','input','keyevent','4')
  times=[n.get('content-desc') for n in tree().iter('node') if re.search(r'\d+:\d+.*[AP]M',n.get('content-desc',''))];assert times,labels();tap(times[0]);node('CANCEL',False);shot(name+'-time-picker');run('shell','input','keyevent','4')
  tap('Cancel');results.append(name);print('PASS '+name+' Home/nav/Find/selectors/photo Cancel/reminder date/time',flush=True)
finally:
 run('shell','cmd','uimode','night',originalNight);run('shell','settings','put','system','font_scale',original);time.sleep(2);run('shell','am','start','-S','-n',pkg+'/.MainActivity');time.sleep(2)
 Path(sys.argv[2]+'/results.json').write_text(json.dumps({'passed':results,'restoredFont':original,'restoredNight':originalNight},indent=2))
