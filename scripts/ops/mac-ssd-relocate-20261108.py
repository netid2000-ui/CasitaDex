#!/usr/bin/env python3
"""Copy, hash-verify, switch and retire only explicit approved development directories."""
from pathlib import Path
import os,sys,json,stat,hashlib,subprocess,shutil,time
HOME_DIR=Path.home()
SSD=Path('/Volumes/FA-Development')
BASE=SSD/'Designs-by-FA'
EVIDENCE=BASE/'QA-Evidence/MacMini/storage-migration-20261108'
ROOT=BASE/'Development-Storage'
EVIDENCE.mkdir(parents=True,exist_ok=True)
TARGETS={
 'gradle':(HOME_DIR/'.gradle',ROOT/'Gradle'),
 'npm':(HOME_DIR/'.npm',ROOT/'npm'),
 'avd':(HOME_DIR/'.android/avd',BASE/'Android/AVD'),
 'derived':(HOME_DIR/'Library/Developer/Xcode/DerivedData',BASE/'Apple-Builds/DerivedData'),
 'simulators':(HOME_DIR/'Library/Developer/CoreSimulator/Devices',BASE/'Apple-Builds/CoreSimulator/Devices'),
}
def dump(path,value):
 temp=path.with_suffix(path.suffix+'.writing');temp.write_text(json.dumps(value,indent=2)+'\n');temp.replace(path)
def digest(path):
 h=hashlib.sha256()
 with path.open('rb') as stream:
  for chunk in iter(lambda:stream.read(8*1024*1024),b''):h.update(chunk)
 return h.hexdigest()
def inventory(root):
 root=root.resolve()
 result={};stack=[root]
 while stack:
  p=stack.pop();rel=str(p.relative_to(root));s=p.lstat()
  if stat.S_ISLNK(s.st_mode):
   result[rel]={'type':'link','target':os.readlink(p)}
  elif stat.S_ISDIR(s.st_mode):
   result[rel]={'type':'directory','mode':stat.S_IMODE(s.st_mode)}
   stack.extend(sorted(p.iterdir(),reverse=True))
  elif stat.S_ISREG(s.st_mode):
   result[rel]={'type':'file','size':s.st_size,'mode':stat.S_IMODE(s.st_mode),'sha256':digest(p)}
  else:raise RuntimeError('Refusing to migrate special file: '+str(p))
 return result
def migrate(key):
 source,destination=TARGETS[key]
 assert SSD.is_mount(),'SSD is not mounted'
 assert shutil.disk_usage(SSD).free>150*1024**3,'SSD reserve insufficient'
 if source.is_symlink():
  assert source.resolve()==destination.resolve(),(key,'Unexpected existing link')
  state=json.loads((EVIDENCE/(key+'-migration.json')).read_text())
  assert state.get('status')=='COMPLETE',state
  print(key,'ALREADY_COMPLETE',flush=True);return
 assert source.is_dir(),str(source)
 reuse=destination.exists()
 if reuse:
  previous=json.loads((EVIDENCE/(key+'-migration.json')).read_text())
  assert previous.get('status')=='VERIFIED','Existing destination needs inspection'
 stage=destination.with_name(destination.name+'.transfer-20261108')
 retired=source.with_name(source.name+'.verified-internal-20261108')
 assert not stage.exists() and not retired.exists(),'Existing transfer needs inspection'
 destination.parent.mkdir(parents=True,exist_ok=True)
 state={'key':key,'source':str(source),'destination':str(destination),'status':'COPYING','started':time.time(),'freeBefore':shutil.disk_usage(HOME_DIR).free}
 dump(EVIDENCE/(key+'-migration.json'),state)
 print(key,'COPYING',flush=True)
 if not reuse:subprocess.run(['/usr/bin/ditto','--rsrc','--extattr','--acl',str(source),str(stage)],check=True)
 print(key,'VERIFYING_SHA256',flush=True)
 before=inventory(source);after=inventory(destination if reuse else stage)
 dump(EVIDENCE/(key+'-source-inventory.json'),before)
 dump(EVIDENCE/(key+'-destination-inventory.json'),after)
 repairs=[]
 if key=='simulators':
  for rel,value in before.items():
   other=after.get(rel)
   if value!=other and other and value.get('type')==other.get('type')=='directory' and rel.endswith('/.DocumentRevisions-V100/staging') and value['mode']^other['mode']==stat.S_ISVTX:
    copied=(destination if reuse else stage)/rel
    os.chmod(copied,value['mode'])
    assert stat.S_IMODE(copied.stat().st_mode)==value['mode']
    after[rel]['mode']=value['mode'];repairs.append(rel)
 state['stickyDirectoryModesRepaired']=len(repairs)
 assert before==after,'Copied data or metadata mismatch; original retained'
 dump(EVIDENCE/(key+'-destination-inventory.json'),after)
 state.update(status='VERIFIED',entries=len(before),files=sum(v['type']=='file' for v in before.values()),bytes=sum(v.get('size',0) for v in before.values()))
 dump(EVIDENCE/(key+'-migration.json'),state)
 if not reuse:stage.rename(destination)
 source.rename(retired)
 try:
  source.symlink_to(destination,target_is_directory=True)
  assert source.resolve()==destination.resolve()
  assert inventory(retired)==before,'Source changed during switchover; original retained'
  assert inventory(source)==after,'Compatibility path verification failed; original retained'
 except Exception:
  if source.is_symlink():source.unlink()
  retired.rename(source)
  raise
 state['status']='SWITCHED_VERIFIED';dump(EVIDENCE/(key+'-migration.json'),state)
 if key=='simulators':
  print(key,'RETAINED_INTERNAL_COPY_PENDING_NATIVE_BOOT',flush=True);return
 # The user authorized freeing internal space after verified transfer.
 # This path is explicit, renamed by this run, and never follows child symlinks.
 assert retired.parent==source.parent and retired.name==source.name+'.verified-internal-20261108'
 shutil.rmtree(retired)
 state.update(status='COMPLETE',finished=time.time(),freeAfter=shutil.disk_usage(HOME_DIR).free)
 dump(EVIDENCE/(key+'-migration.json'),state)
 print(key,'COMPLETE',json.dumps({k:state[k] for k in ['entries','files','bytes','freeAfter']}),flush=True)
if __name__=='__main__':
 for key in sys.argv[1:]:migrate(key)
