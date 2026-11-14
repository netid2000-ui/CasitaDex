"""Verify only label names changed, with IDs and all saved content retained."""
from pathlib import Path
import subprocess,sqlite3,json,sys
folder=Path(sys.argv[1]);u='81FC3CCE-ACEB-4957-BE61-C9C653A4CE56'
c=Path(subprocess.check_output(['xcrun','simctl','get_app_container',u,'com.designsbyfa.casitadex.plusstoreqa','data'],text=True).strip());assert '/'+u+'/' in str(c)
with sqlite3.connect('file:'+str(c/'Documents/SQLite/casitadex-development-v1.db')+'?mode=ro',uri=True) as db:s=json.loads(db.execute('select payload from eng_state_v2 where slot=1').fetchone()[0])
before=json.loads((folder/'before.json').read_text());count=0
for table,kind in [('spaces','Space'),('categories','Category')]:
 assert len(s['data'][table])==len(before['data'][table])
 for old in before['data'][table]:
  new=next(x for x in s['data'][table] if x['id']==old['id'])
  if old['name'] in [prefix+' rapid '+kind+' 20x25x1' for prefix in ['Edit','Draft']]:
   assert new['name'].count('RENAMED')==1
   assert new['name'].replace('RENAMED ','')==old['name'] or (new['name'].endswith('RENAMED') and new['name'][:-7]==old['name']);count+=1
  else:assert new==old
assert count==4
assert s['data']['memories']==before['data']['memories']
assert s['draft']==before['draft']
assert s['data']['media']==before['data']['media']
assert s['attempts']==before['attempts']
print(json.dumps({'result':'PASS','renamedLabels':count,'labelIdsPreserved':True,'allMemoriesUnchanged':len(s['data']['memories']),'draftUnchanged':True,'mediaUnchanged':True},indent=2))
