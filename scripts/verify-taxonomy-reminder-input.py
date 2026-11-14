"""Read-only acceptance of isolated native taxonomy/reminder input checks."""
from pathlib import Path
import subprocess,sqlite3,json,sys
folder=Path(sys.argv[1]);u=sys.argv[2]
assert u=='81FC3CCE-ACEB-4957-BE61-C9C653A4CE56'
c=Path(subprocess.check_output(['xcrun','simctl','get_app_container',u,'com.designsbyfa.casitadex.plusstoreqa','data'],text=True).strip())
assert '/'+u+'/' in str(c)
with sqlite3.connect('file:'+str(c/'Documents/SQLite/casitadex-development-v1.db')+'?mode=ro',uri=True) as db:
 db.row_factory=sqlite3.Row
 s=json.loads(db.execute('select payload from eng_state_v2 where slot=1').fetchone()[0])
 reminders=[dict(r) for r in db.execute('select * from standalone_reminders_v1 order by id')]
before=json.loads((folder/'before.json').read_text())
assert len(s['data']['memories'])==19
m=next(x for x in s['data']['memories'] if x['id']=='rapid_edit_fixture')
for key,kind in [('spaces','Space'),('categories','Category')]:
 matches=[x for x in s['data'][key] if x['name']=='Boundary rapid '+kind+' 20x25x1']
 assert len(matches)==1,(key,matches)
 assert matches[0]['id']==m['spaceId'] if key=='spaces' else matches[0]['id'] in m['categoryIds']
 assert all(x in s['data'][key] for x in before['data'][key])
for old in before['data']['memories']:
 if old['id']!='rapid_edit_fixture':assert old==next(x for x in s['data']['memories'] if x['id']==old['id']),old['id']
r=[x for x in reminders if x['title']=='Boundary rapid reminder 20x25x1']
assert len(r)==1 and r[0]['notes']=='Garage filter replacement 20x25x1'
assert all('UNSAVED' not in x['title'] for x in reminders)
assert all(x in reminders for x in json.loads((folder/'reminders-before.json').read_text()))
print(json.dumps({'result':'PASS','savedMemories':19,'exactCreatedAndAssignedTaxonomies':2,'otherMemoriesUnchanged':18,'exactReminderTitleAndNotes':True,'cancelledReminderTextAbsent':True},indent=2))
