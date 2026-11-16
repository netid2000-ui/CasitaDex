"""Focus-only keyboard sweep. Does not enter text or save/delete memories, labels or reminders."""
import os,sys,time,json,re,traceback
from pathlib import Path
sys.path.insert(0,'scripts/samsung-sweep-20261115');import phone
phone.serial=os.environ.get('QA_SERIAL','emulator-5554');phone.out=Path('docs/qa/evidence/keyboard-field-sweep-20261115')/phone.serial/os.environ.get('QA_RUN','initial');phone.out.mkdir(parents=True,exist_ok=True)
from phone import *
records=[]
def save(): (out/'results.json').write_text(json.dumps(records,indent=2))
def probe(label,key):
 hidekeyboard();n=node(label);old=n.get('text');beforeBounds=bounds(n);tap(label);time.sleep(1)
 w=run('shell','dumpsys','window').decode();frames=re.findall(r'type=ime frame=\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]',w)
 frames=[tuple(map(int,x)) for x in frames if int(x[3])>int(x[1])]
 t=tree();focused=[n for n in t.iter('node') if n.get('focused')=='true' and n.get('class','').endswith('EditText')]
 result={'case':key,'label':label,'scale':scale,'theme':theme,'keyboardFrames':frames,'beforeBounds':beforeBounds}
 try:
  assert frames,'No measurable onscreen keyboard; not a pass'
  assert len(focused)==1 and focused[0].get('content-desc')==label,[(n.get('content-desc'),n.get('bounds')) for n in focused]
  x,y,a,b=bounds(focused[0]);top=min(f[1] for f in frames);result.update(fieldBounds=[x,y,a,b],keyboardTop=top)
  assert y>=60 and b<=top-8,(y,b,top)
  assert b-y>=beforeBounds[3]-beforeBounds[1]-3,('Input clipped by fixed content',beforeBounds,[x,y,a,b])
  assert focused[0].get('text')==old,'Value changed'
  result['status']='PASS'
 except AssertionError as e:result.update(status='FAIL',error=str(e))
 (out/(key+'.xml')).write_bytes(ET.tostring(t));(out/(key+'.png')).write_bytes(run('exec-out','screencap','-p'))
 records.append(result);save();print(json.dumps(result),flush=True);hidekeyboard()
def optional(label,key):tap('Edit '+label);probe(label,key);tap('Done editing '+label)
def add():
 route('add');probe('Memory name (Required)','add-name');probe('Description','add-description');optional('Notes','add-notes');optional('Reference','add-reference')
 for noun,choice in [('Space','Choose Space'),('Category','Choose Categories')]:
  tap(choice);tap('+ Create new '+noun+' ▾');probe('New '+noun+' name','add-new-'+noun.lower());tap('Create new '+noun+' ▴');tap(choice)
def location():
 route('add');tap('Choose Location');probe('Search locations','location-search');tap('Create new Location');probe('Location name','location-create');tap('Cancel')
def edit():
 route('card?id=sb26qa_007');tap('Edit memory');probe('Memory name (Required)','edit-name');probe('Description','edit-description');optional('Notes','edit-notes');optional('Reference','edit-reference')
 for noun,key,choice in [('Space','space','Choose Space'),('Categories','category','Choose Categories')]:
  tap(choice);tap('+ Create new '+noun+' ▾');probe('New '+key+' name','edit-new-'+key);tap('Create new '+noun+' ▴');tap(choice)
 tap('Cancel')
def details():
 route('card?id=sb26qa_007');tap('Edit Reference');probe('Reference','details-reference');tap('Cancel');tap('Choose verification status');probe('Reference checked','verification-reference');probe('History note','history-note');tap('Close verification choices')
 try:node('Next reminder (YYYY-MM-DD)',False)
 except AssertionError:print('No due-date field in selected fixture',flush=True)
 else:probe('Next reminder (YYYY-MM-DD)','next-reminder')
def reminders():
 route('reminders-manage?mode=new');probe('Reminder title (Required)','reminder-title');tap('More options ▾');probe('Notes','reminder-notes');tap('Cancel')
def labels():
 for noun,tab in [('Space','Spaces'),('Category','Categories'),('Location','Locations')]:
  route('');route('settings-manage?action=labels');tap(tab);probe('Search labels','labels-search-'+noun.lower());tap('Create new label');probe(noun+' name','labels-create-'+noun.lower());tap('Cancel')
  t=tree();excluded={'‹ Settings','Spaces','Categories','Locations','Create new label','Home','Photos','Reminders','Find'}
  choices=[n.get('content-desc') for n in t.iter('node') if n.get('clickable')=='true' and n.get('content-desc') and n.get('content-desc') not in excluded and not n.get('content-desc').startswith('Space:') and not n.get('class','').endswith('EditText')]
  if choices:
   tap(choices[0]);tap('Rename ›');probe(noun+' name','labels-rename-'+noun.lower());tap('Cancel')
  else:print('No existing '+noun+' label in visible scope for rename',flush=True)
def find():route('answers');probe('Search memories','find-query')
groups={'reminders':reminders,'add':add,'location':location,'edit':edit,'details':details,'labels':labels,'find':find}
original=run('shell','settings','get','system','font_scale').decode().strip()
try:
 for scale,theme in [('1.0','Light'),('2.0','Dark')]:
  if os.environ.get('QA_SCALE') and scale!=os.environ['QA_SCALE']:continue
  run('shell','settings','put','system','font_scale',scale);time.sleep(3);route('settings-manage?action=appearance');tap(theme+' appearance')
  for name,fn in groups.items():
   if os.environ.get('QA_GROUP') and name not in os.environ['QA_GROUP'].split(','):continue
   try:fn()
   except Exception as e:
    records.append({'group':name,'scale':scale,'status':'HARNESS_OR_NAVIGATION_ERROR','error':str(e)});save();print(traceback.format_exc(),flush=True);hidekeyboard()
finally:
 hidekeyboard();run('shell','settings','put','system','font_scale',original);time.sleep(3);route('settings-manage?action=appearance');tap('System appearance');route('add')
 (out/'settings.json').write_text(json.dumps({'fontScale':original,'appearance':'System'}))
print('COMPLETE',json.dumps({'pass':sum(x.get('status')=='PASS' for x in records),'other':sum(x.get('status')!='PASS' for x in records)}),flush=True)
