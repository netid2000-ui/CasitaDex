"""Read-only verification of manager-created and fully renamed test labels."""
from pathlib import Path
import subprocess,sqlite3,json,sys
folder=Path(sys.argv[1]);u='81FC3CCE-ACEB-4957-BE61-C9C653A4CE56'
c=Path(subprocess.check_output(['xcrun','simctl','get_app_container',u,'com.designsbyfa.casitadex.plusstoreqa','data'],text=True).strip());assert '/'+u+'/' in str(c)
with sqlite3.connect('file:'+str(c/'Documents/SQLite/casitadex-development-v1.db')+'?mode=ro',uri=True) as db:s=json.loads(db.execute('select payload from eng_state_v2 where slot=1').fetchone()[0])
before=json.loads((folder/'before.json').read_text())
for table,kind in [('spaces','Space'),('categories','Category')]:
 assert len(s['data'][table])==len(before['data'][table])+1
 assert all(x in s['data'][table] for x in before['data'][table])
 assert len([x for x in s['data'][table] if x['name']=='Manager replaced '+kind+' 20x25x1'])==1
 assert not any(x['name']=='Manager new '+kind+' 20x25x1' for x in s['data'][table])
assert s['data']['memories']==before['data']['memories'];assert s['draft']==before['draft'];assert s['data']['media']==before['data']['media']
print(json.dumps({'result':'PASS','newLabelsFullyRenamed':2,'existingLabelsUnchanged':True,'allMemoriesUnchanged':len(s['data']['memories']),'draftUnchanged':True,'mediaUnchanged':True},indent=2))
