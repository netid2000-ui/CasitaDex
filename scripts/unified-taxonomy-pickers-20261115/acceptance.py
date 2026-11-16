import os
source=open('scripts/keyboard-field-sweep-20261115/sweep.py').read();exec(source[:source.index("original=run('shell','settings'")])
original=run('shell','settings','get','system','font_scale').decode().strip()
def value(label):
 n=node('Choose '+label);return n.get('text') or n.get('content-desc','').partition(', ')[2]
def ensure_picker(label,noun,creating=False):
 t=tree();texts=[n.get('text','') for n in t.iter('node')]
 if not any(n.get('content-desc') in ['Create new '+noun,noun+' name'] for n in t.iter('node')):tap('Choose '+label)
 if creating and not any(n.get('content-desc')==noun+' name' for n in tree().iter('node')):tap('Create new '+noun)
def passed(case,**extra):
 records.append({'case':case,'scale':scale,'theme':theme,'status':'PASS',**extra});save();print('PASS '+case,flush=True)
try:
 for scale,theme in ([('2.0','Dark')] if os.environ.get('QA_LARGE_ONLY') else [('1.0','Light'),('2.0','Dark')]):
  run('shell','settings','put','system','font_scale',scale);time.sleep(3);run('shell','am','force-stop',pkg);route('');time.sleep(7);route('settings-manage?action=appearance');time.sleep(2);tap(theme+' appearance');home();route('add')
  before={n.get('content-desc'):n.get('text') for n in tree().iter('node') if n.get('class','').endswith('EditText')}
  for label,noun,search in [('Space','Space','Search spaces'),('Categories','Category','Search categories'),('Location','Location','Search locations')]:
   tap('Choose '+label);shot(scale+'-'+label+'-picker');probe(search,label+'-search')
   ensure_picker(label,noun);tap('Create new '+noun);probe(noun+' name',label+'-create');ensure_picker(label,noun,True);tap('Cancel')
   assert any(n.get('content-desc','').startswith('Choose '+label) for n in tree().iter('node'));passed(label+'-cancel-return')
  after={n.get('content-desc'):n.get('text') for n in tree().iter('node') if n.get('class','').endswith('EditText')};assert all(after.get(k)==v for k,v in before.items()),(before,after);passed('draft-text-preserved')
  home();route('card?id=sb26qa_007');tap('Edit memory')
  originalCategory=value('Categories');tap('Choose Categories');tap('None');tap('Cancel');assert value('Categories')==originalCategory;passed('category-cancel-preserves-edit')
  tap('Choose Categories')
  opts=[n.get('content-desc') for n in tree().iter('node') if n.get('class')=='android.widget.Button' and n.get('content-desc') not in ['Cancel','Done','None','Create new Category'] and n.get('content-desc')]
  assert len(opts)>=2,opts
  tap('None');tap(opts[0]);tap(opts[1]);tap('Done')
  text=value('Categories');assert opts[0] in text and opts[1] in text,(text,opts);shot(scale+'-categories-done');passed('categories-multiple-done',choices=opts[:2])
  tap('Choose Categories');tap('None');tap('Cancel');assert value('Categories')==text;passed('category-cancel-retains-committed-edit')
  tap('Cancel');tap('Edit memory');assert value('Categories')==originalCategory;passed('memory-cancel-restores-saved-categories')
  tap('Choose Space')
  spaces=[n.get('content-desc') for n in tree().iter('node') if n.get('class')=='android.widget.Button' and n.get('content-desc') not in ['Cancel','None','Create new Space'] and n.get('content-desc')]
  assert spaces;tap(spaces[0]);assert value('Space')==spaces[0];passed('space-single-select-return')
  tap('Choose Location');assert any('Space: '+spaces[0] in (n.get('text') or '') for n in tree().iter('node'));tap('None');passed('location-none-return');tap('Cancel')
finally:
 hidekeyboard();run('shell','settings','put','system','font_scale',original);time.sleep(3);run('shell','am','force-stop',pkg);route('');time.sleep(7);route('settings-manage?action=appearance');time.sleep(2);tap('System appearance');home()
assert all(r['status']=='PASS' for r in records),records
print('COMPLETE unified picker acceptance '+str(len(records)),flush=True)
