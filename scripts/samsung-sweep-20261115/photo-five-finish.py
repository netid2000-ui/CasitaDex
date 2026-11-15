from phone import *
node('Save as separate memory');shot('photo-duplicate-review');tap('Save as separate memory');time.sleep(1)
route('photos')
tap('View photo 1 of QA Samsung Photo Sweep full screen')
node('Next photo');assert node('Previous photo').get('enabled')=='false'
for i in range(2,6):
 tap('Next photo');assert any(('Photo '+str(i)+' of 5') in (a or '') for a,b in labels())
assert node('Next photo').get('enabled')=='false'
for i in range(4,0,-1):
 tap('Previous photo');assert any(('Photo '+str(i)+' of 5') in (a or '') for a,b in labels())
shot('five-photo-navigation')
print('Five-photo saved sequence and bounds PASS',flush=True)
