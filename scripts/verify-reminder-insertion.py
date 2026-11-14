"""Read-only SQLite verification for the isolated reminder editing regression."""
from pathlib import Path
import subprocess,sqlite3,json,sys,hashlib
folder=Path(sys.argv[1]);u='81FC3CCE-ACEB-4957-BE61-C9C653A4CE56'
c=Path(subprocess.check_output(['xcrun','simctl','get_app_container',u,'com.designsbyfa.casitadex.plusstoreqa','data'],text=True).strip());assert '/'+u+'/' in str(c)
before=json.loads((folder/'before.json').read_text())
with sqlite3.connect('file:'+str(c/'Documents/SQLite/casitadex-development-v1.db')+'?mode=ro',uri=True) as db:
 db.row_factory=sqlite3.Row
 payload=db.execute('select payload from eng_state_v2 where slot=1').fetchone()[0]
 rows=[dict(r) for r in db.execute('select * from standalone_reminders_v1')]
assert payload==before['payload'],'Memory payload changed'
assert len(rows)==len(before['reminders'])+1
old=next(r for r in before['reminders'] if r['id']=='r_mwgtiw73_fpe8npbq')
new=next(r for r in rows if r['id']==old['id'])
assert new['title']=='INSERT '+old['title']
assert {k:v for k,v in new.items() if k not in ['title','updated_at']}=={k:v for k,v in old.items() if k not in ['title','updated_at']}
linked=[r for r in rows if r['memory_id']=='rapid_edit_fixture'];assert len(linked)==1
assert linked[0]['title']=='LINKED Review Boundary rapid editing 20x25x1'
assert linked[0]['notes']=='Boundary twenty first memory rapid typing 20x25x1'
assert not any('CANCEL ' in r['title'] for r in rows)
print(json.dumps({'result':'PASS','memoryPayloadUnchanged':True,'existingTitleExact':True,'existingOtherFieldsUnchanged':True,'linkedReminderExact':True,'cancelledInsertionAbsent':True,'reminderCount':len(rows)},indent=2))
