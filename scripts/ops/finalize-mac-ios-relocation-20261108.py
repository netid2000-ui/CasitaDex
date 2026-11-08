#!/usr/bin/env python3
"""Retire the internal duplicate only after recorded native and data verification."""
from pathlib import Path
import os,json,stat,shutil,subprocess,time,hashlib,sqlite3
BASE=Path('/Volumes/FA-Development/Designs-by-FA')
OUT=BASE/'QA-Evidence/MacMini/storage-migration-20261108'
source=Path.home()/'Library/Developer/CoreSimulator/Devices'
retired=source.with_name(source.name+'.verified-internal-20261108')
destination=BASE/'Apple-Builds/CoreSimulator/Devices'
proof=json.loads((OUT/'ios-relocation-verification.json').read_text())
assert proof['status']=='PASS' and proof['nativeHouseholdHomeUI']=='PASS' and proof['retainedInternalCopyMayBeRetired']
assert source.is_symlink() and source.resolve()==destination.resolve()
state=json.loads((OUT/'simulators-migration.json').read_text())
assert state['status']=='SWITCHED_VERIFIED' and retired.is_dir() and not retired.is_symlink()
# Re-check every retained entry's structure, byte count and mode. File content hashes were
# already compared in full before switching; protected app/data hashes are checked again.
expected=json.loads((OUT/'simulators-source-inventory.json').read_text())
seen=set();stack=[retired]
while stack:
 p=stack.pop();rel=str(p.relative_to(retired));s=p.lstat();v=expected[rel];seen.add(rel)
 if stat.S_ISLNK(s.st_mode):assert v['type']=='link' and os.readlink(p)==v['target']
 elif stat.S_ISDIR(s.st_mode):
  assert v['type']=='directory' and stat.S_IMODE(s.st_mode)==v['mode'];stack.extend(p.iterdir())
 elif stat.S_ISREG(s.st_mode):assert v['type']=='file' and s.st_size==v['size'] and stat.S_IMODE(s.st_mode)==v['mode']
 else:raise RuntimeError('Unexpected retained file type')
assert seen==set(expected),'Retained original changed'
for row in json.loads((OUT/'sb40-before.json').read_text()):
 if 'appRelativePath' in row:
  app=source/row['appRelativePath']
  assert hashlib.sha256((app/'CasitaDexSB40QA').read_bytes()).hexdigest()==row['executableSha256']
  assert hashlib.sha256((app/'main.jsbundle').read_bytes()).hexdigest()==row['bundleSha256']
 else:
  db=source/row['dbRelativePath'];c=sqlite3.connect(db.as_uri()+'?mode=ro',uri=True)
  payload=c.execute('SELECT payload FROM eng_state_v2 WHERE slot=1').fetchone()[0];c.close()
  assert hashlib.sha256(payload.encode()).hexdigest()==row['snapshotSha256']
r=subprocess.run(['/usr/sbin/lsof','-n','-P','-u',str(os.getuid()),'-Fn'],capture_output=True,text=True)
assert r.returncode in [0,1]
opened=[line for line in r.stdout.splitlines() if line.startswith('n'+str(retired))]
assert not opened,'A process still uses the retained internal copy'
assert retired.parent==Path.home()/'Library/Developer/CoreSimulator'
print('RETIRING_VERIFIED_INTERNAL_DUPLICATE',len(expected),'entries',flush=True)
shutil.rmtree(retired)
state.update(status='COMPLETE',finished=time.time(),freeAfter=shutil.disk_usage(Path.home()).free,nativeVerification='PASS',internalDuplicateRetired=True)
(OUT/'simulators-migration.json').write_text(json.dumps(state,indent=2)+'\n')
print('COMPLETE',json.dumps({'internalFreeGiB':round(state['freeAfter']/1024**3,2),'simulatorEntriesPreserved':len(expected)}),flush=True)
