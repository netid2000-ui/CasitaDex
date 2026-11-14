"""Read-only assertions for final Find/inline rapid-input acceptance."""
from pathlib import Path
import subprocess,sqlite3,json,sys
folder=Path(sys.argv[1]);udid=sys.argv[2]
c=Path(subprocess.check_output(['xcrun','simctl','get_app_container',udid,'com.designsbyfa.casitadex.plusstoreqa','data'],text=True).strip())
assert '/'+udid+'/' in str(c)
with sqlite3.connect('file:'+str(c/'Documents/SQLite/casitadex-development-v1.db')+'?mode=ro',uri=True) as db:s=json.loads(db.execute('select payload from eng_state_v2 where slot=1').fetchone()[0])
assert len(s['data']['memories'])==19 and s['draft'] is None
records={m['id']:m for m in s['data']['memories']}
for identity,key,value in [('rapid_edit_fixture','title','Boundary rapid editing 20x25x1'),('rapid_edit_location','location','Boundary rapid editing 20x25x1'),('rapid_edit_reference','source','Boundary rapid editing 20x25x1'),('rapid_inline_reference','source','Boundary inline reference 20x25x1')]:
 assert records[identity][key]==value,(identity,records[identity][key])
 assert 'UNSAVED' not in json.dumps(records[identity])
original=json.loads((folder/'clone-original.json').read_text())['data']['memories'][4:19]
seeded=[]
for memory in original:
 memory['mediaIds']=[]
 actual=records[memory['id']]
 if actual!=memory:
  # Existing QA Home setup replenishes the two retained sample photo fixtures.
  assert memory['id'] in ['sb26qa_007','sb26qa_013']
  assert len(actual['mediaIds'])==1
  assert actual['events'][:-1]==memory.get('events',[])
  assert actual['events'][-1]['type']=='answer_edited' and actual['events'][-1]['note']=='Photo added'
  assert {k:v for k,v in actual.items() if k not in ['mediaIds','events','updatedAt']}=={k:v for k,v in memory.items() if k not in ['mediaIds','events','updatedAt']}
  seeded.append(memory['id'])
print(json.dumps({'result':'PASS','savedCount':19,'exactPersistedEdits':4,'cancelledTextAbsent':True,'otherAuthoredRecordsUnchanged':15,'existingAutomaticPhotoFixtures':seeded,'draftAbsent':True},indent=2))
