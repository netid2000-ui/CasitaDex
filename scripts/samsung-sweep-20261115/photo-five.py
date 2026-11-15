from phone import *
def pick_file(filename):
 # Invoked while Android's document picker is open.
 visible=[(a or b or '') for a,b in labels()]
 if not any(v==filename or v.startswith(filename+', ') for v in visible):
  tap('Show roots');tap('Galaxy A16 5G');tap('Documents');tap('CasitaDex-QA-20261115')
 tap(filename)
for i in range(2,6):
 tap('+ Add Photo');tap('Browse Files');pick_file('QA-photo-two.jpg' if i%2==0 else 'QA-photo-one.jpg')
 node('+ Add Photo');shot('photo-draft-'+str(i))
 assert any(str(i)+'/5' in (a or '') for a,b in labels())
 print(str(i)+' draft photos imported',flush=True)
assert node('+ Add Photo').get('enabled')=='false'
shot('photo-five-limit');tap('Save');route('photos')
tap('View photo 1 of QA Samsung Photo Sweep full screen')
node('Next photo');assert node('Previous photo').get('enabled')=='false'
for i in range(2,6):
 tap('Next photo');assert any(('Photo '+str(i)+' of 5') in (a or '') for a,b in labels())
assert node('Next photo').get('enabled')=='false'
for i in range(4,0,-1):
 tap('Previous photo');assert any(('Photo '+str(i)+' of 5') in (a or '') for a,b in labels())
shot('five-photo-navigation')
print('Five-photo saved sequence and bounds PASS',flush=True)
