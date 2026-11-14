"""Prepare a disposable Find/inline-input fixture through the guarded boundary setup."""
from pathlib import Path
import subprocess,sys,json,sqlite3
folder=Path(sys.argv[1]);udid=sys.argv[2]
subprocess.run([sys.executable,str(Path(__file__).with_name('prepare-memory-boundary.py')),str(folder),udid,'--empty-draft'],check=True)
f=json.loads((folder/'fixture.json').read_text())
assert '/'+udid+'/' in f['database']
with sqlite3.connect(f['database']) as db:
 s=json.loads(db.execute('select payload from eng_state_v2 where slot=1').fetchone()[0])
 m=s['data']['memories'][0]
 m.update(id='rapid_edit_fixture',title='X',answer='Boundary twenty first memory rapid typing 20x25x1',location='',source='',history=[],events=[],confidence='Unknown')
 m.pop('due',None)
 for index,identity in enumerate(['rapid_edit_location','rapid_edit_reference','rapid_inline_reference'],1):
  target=s['data']['memories'][index]
  target.update(id=identity,title='Fixture '+identity,answer='Separate input control',location='',source='',history=[],events=[],confidence='Unknown')
  target.pop('due',None)
 s['draft']=None
 db.execute('update eng_state_v2 set payload=? where slot=1',(json.dumps(s),))
print('Prepared rapid_edit_fixture on verified simulator copy')
