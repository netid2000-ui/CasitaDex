"""Prepare only the explicitly named boundary-test simulator copy, never the original QA device."""
from pathlib import Path
import json, sqlite3, subprocess, sys
folder=Path(sys.argv[1]);udid=sys.argv[2]
devices=json.loads(subprocess.check_output(['xcrun','simctl','list','devices','--json'],text=True))
device=next(d for group in devices['devices'].values() for d in group if d['udid']==udid)
assert device['name']=='CasitaDex Memory Boundary Isolated QA' and device['state']=='Booted'
container=Path(subprocess.check_output(['xcrun','simctl','get_app_container',udid,'com.designsbyfa.casitadex.plusstoreqa','data'],text=True).strip())
assert '/'+udid+'/' in str(container), 'Clone still references another simulator container; refuse write'
dbpath=container/'Documents/SQLite/casitadex-development-v1.db'
assert dbpath.exists()
subprocess.run(['xcrun','simctl','terminate',udid,'com.designsbyfa.casitadex.plusstoreqa'],capture_output=True)
s=json.loads((folder/'clone-original.json').read_text());s['data']['memories']=s['data']['memories'][:19]
assert len(s['data']['memories'])==19
for m in s['data']['memories']:m['mediaIds']=[]
s['data']['media']['media']=[];s['attempts']={};s['draft']={'id':'boundary_draft20','attempt':'boundary_attempt20','memoryId':'boundary_memory20','checkpoint':1,'title':'Boundary twentieth memory','answer':'Native save verification','location':'','notes':'','source':'','spaceId':None,'legacyContext':None,'categoryIds':[],'photos':[]};s['revision']+=1
if '--empty-draft' in sys.argv:s['draft']['title']='';s['draft']['answer']=''
with sqlite3.connect(dbpath) as db:db.execute('UPDATE eng_state_v2 SET payload=? WHERE slot=1',(json.dumps(s),))
(folder/'fixture.json').write_text(json.dumps({'simulator':udid,'database':str(dbpath),'savedCount':19},indent=2))
print('Prepared boundary simulator copy with 19 saved memories and one draft')
