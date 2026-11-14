"""Read-only verification of full-edit assignments and retained draft taxonomy."""
from pathlib import Path
import subprocess,sqlite3,json,sys
folder=Path(sys.argv[1]);u='81FC3CCE-ACEB-4957-BE61-C9C653A4CE56'
c=Path(subprocess.check_output(['xcrun','simctl','get_app_container',u,'com.designsbyfa.casitadex.plusstoreqa','data'],text=True).strip());assert '/'+u+'/' in str(c)
with sqlite3.connect('file:'+str(c/'Documents/SQLite/casitadex-development-v1.db')+'?mode=ro',uri=True) as db:s=json.loads(db.execute('select payload from eng_state_v2 where slot=1').fetchone()[0])
before=json.loads((folder/'before.json').read_text());assert len(s['data']['memories'])==19
m=next(x for x in s['data']['memories'] if x['id']=='rapid_edit_fixture');draft=s['draft'];assert draft is not None
for prefix,record in [('Edit',m),('Draft',draft)]:
 for table,kind in [('spaces','Space'),('categories','Category')]:
  matches=[x for x in s['data'][table] if x['name']==prefix+' rapid '+kind+' 20x25x1'];assert len(matches)==1
  if kind=='Space':assert record['spaceId']==matches[0]['id']
  else:assert matches[0]['id'] in record['categoryIds']
for table in ['spaces','categories']:
 assert len(s['data'][table])==len(before['data'][table])+2
 assert all(x in s['data'][table] for x in before['data'][table])
for old in before['data']['memories']:
 actual=next(x for x in s['data']['memories'] if x['id']==old['id'])
 if old['id']!='rapid_edit_fixture':assert actual==old,old['id']
 else:
  ignore=['spaceId','categoryIds','history','events','updatedAt']
  assert {k:v for k,v in actual.items() if k not in ignore}=={k:v for k,v in old.items() if k not in ignore}
  assert all(x in actual['categoryIds'] for x in old['categoryIds'])
assert s['data']['media']==before['data']['media']
print(json.dumps({'result':'PASS','savedMemories':19,'exactNewTaxonomies':4,'draftAssignmentsPersisted':True,'fullEditAssignmentsPersisted':True,'priorCategoriesRetained':True,'otherMemoriesUnchanged':18,'mediaUnchanged':True},indent=2))
