"""Create a marked QA reminder through native UI, then verify its notification tap."""
import sys,os,time,re,json,datetime
from pathlib import Path
sys.path.insert(0,'scripts/samsung-sweep-20261115');import phone
phone.adb='/Volumes/FA-Development/Designs-by-FA/Android/Sdk/platform-tools/adb'
phone.serial=os.environ.get('QA_SERIAL','emulator-5554')
phone.out=Path('docs/qa/evidence/android-notification-routing-20261116')/phone.serial/os.environ.get('QA_RUN','initial');phone.out.mkdir(parents=True,exist_ok=True)
run=phone.run;tree=phone.tree;bounds=phone.bounds
apkpath=run('shell','pm','path',phone.pkg).decode().strip().split(':',1)[1]
apkhash=run('shell','sha256sum',apkpath).decode().split()[0]
assert apkhash==os.environ['QA_APK_SHA256'],'Installed APK changed before test'

name='QA route '+phone.serial+' '+str(int(time.time()))
def click(n):
 x,y,a,b=bounds(n);assert a>x and b>y;run('shell','input','tap',str((x+a)//2),str((y+b)//2));time.sleep(.5)
def locate(label):
 for _ in range(8):
  matches=[n for n in tree().iter('node') if n.get('content-desc')==label or n.get('text')==label]
  if matches:return sorted(matches,key=lambda n:n.get('clickable')!='true')[0]
  time.sleep(.5)
 raise AssertionError('Missing '+label)
def tap(label):click(locate(label))
def field_id(id,value):
 n=next(n for n in tree().iter('node') if n.get('resource-id')==id);click(n)
 run('shell','input','keyevent','123');run('shell','input','keyevent',*(['67']*len(n.get('text',''))));run('shell','input','text',value)
 assert next(n for n in tree().iter('node') if n.get('resource-id')==id).get('text')==value
if any(n.get('text')=='KEEP EDITING' for n in tree().iter('node')):tap('KEEP EDITING')
if not any(n.get('content-desc')=='Reminder title (Required)' for n in tree().iter('node')):
 phone.route('reminders-manage?mode=new');time.sleep(3)
n=locate('Reminder title (Required)');old=n.get('text','');assert not old or old.startswith('QA route '),'Preserve unrelated draft'
click(n);run('shell','input','keyevent','123')
if old:run('shell','input','keyevent',*(['67']*len(old)))
run('shell','input','text',name.replace(' ','%s'))
assert locate('Reminder title (Required)').get('text')==name
print('Entered marked QA title',flush=True)
current=datetime.datetime.strptime(run('shell','date','+%Y-%m-%dT%H:%M:%S%z').decode().strip(),'%Y-%m-%dT%H:%M:%S%z')
target=current+datetime.timedelta(minutes=2)
clock=next(n.get('content-desc') for n in tree().iter('node') if re.fullmatch(r'[0-9]{1,2}:[0-9]{2}\s*[AP]M',n.get('content-desc','')));tap(clock)
tap('Switch to text input mode for the time input.')
field_id('android:id/input_hour',str(target.hour%12 or 12));field_id('android:id/input_minute',target.strftime('%M'))
period=target.strftime('%p');periodnode=next(n for n in tree().iter('node') if n.get('resource-id')=='android:id/text1')
if periodnode.get('text')!=period:click(periodnode);tap(period)
tap('OK')
expected=str(target.hour%12 or 12)+target.strftime(':%M')
assert any(expected in n.get('content-desc','') and period in n.get('content-desc','') for n in tree().iter('node'))
phone.shot('scheduled');tap('Save Reminder');time.sleep(2)
for n in tree().iter('node'):
 if n.get('resource-id')=='com.android.permissioncontroller:id/permission_allow_button':click(n);break
# Backgrounding with Home retains Android's scheduled alarms (force-stop would cancel them).
run('shell','input','keyevent','3');start=time.monotonic();found=False
while time.monotonic()-start<180:
 data=run('shell','dumpsys','notification','--noredact').decode()
 if name in data:found=True;break
 time.sleep(3)
assert found,'No notification observed for marked QA reminder'
run('shell','cmd','statusbar','expand-notifications');time.sleep(1);phone.shot('notification');tap(name)
for _ in range(15):
 nodes=list(tree().iter('node'));matches=[n for n in nodes if n.get('content-desc')=='Reminder title (Required)' and n.get('text')==name]
 if matches:break
 time.sleep(1)
assert matches,'Notification did not open exact saved reminder'
phone.shot('exact-reminder');tap('Cancel');tap('Home')
assert run('shell','sha256sum',apkpath).decode().split()[0]==apkhash,'Installed APK changed during test'
result={'apkSha256':apkhash,'status':'PASS','serial':phone.serial,'name':name,'scheduledTime':target.isoformat(),'backgroundNotificationObserved':True,'exactReminderOpened':True,'cancelHomePassed':True}
(phone.out/'result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result),flush=True)
