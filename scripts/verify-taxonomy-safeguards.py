"""Read-only proof that rejected duplicates and canceled reviews changed nothing."""
from pathlib import Path
import subprocess,sqlite3,json,sys,hashlib
folder=Path(sys.argv[1]);u='81FC3CCE-ACEB-4957-BE61-C9C653A4CE56'
c=Path(subprocess.check_output(['xcrun','simctl','get_app_container',u,'com.designsbyfa.casitadex.plusstoreqa','data'],text=True).strip());assert '/'+u+'/' in str(c)
with sqlite3.connect('file:'+str(c/'Documents/SQLite/casitadex-development-v1.db')+'?mode=ro',uri=True) as db:raw=db.execute('select payload from eng_state_v2 where slot=1').fetchone()[0]
assert raw==(folder/'before.json').read_text(),'Unexpected snapshot mutation'
s=json.loads(raw)
print(json.dumps({'result':'PASS','exactPayloadUnchanged':True,'savedMemories':len(s['data']['memories']),'draftRetained':s['draft'] is not None,'sha256':hashlib.sha256(raw.encode()).hexdigest()},indent=2))
