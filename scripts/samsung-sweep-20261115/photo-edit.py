from phone import *
def actions():
 if any(b=='Manage photos' for a,b in labels()):tap('Manage photos')
def pick_file(filename):
 visible=[(a or b or '') for a,b in labels()]
 if not any(v==filename or v.startswith(filename+', ') for v in visible):
  tap('Show roots');tap('Galaxy A16 5G');tap('Documents');tap('CasitaDex-QA-20261115')
 tap(filename)
def photo_count(count):
 assert any(re.search(r'Photo \d+ of '+str(count),a or '') for a,b in labels())
imageNode=next(n for n in tree().iter('node') if n.get('content-desc','').startswith('Photo 1 of'))
x,y,a,b=bounds(imageNode);cy=str((y+b)//2)
run('shell','input','swipe','820',cy,'260',cy,'300');photo_count(5)
assert any('Photo 2 of 5' in (a or '') for a,b in labels())
actions();tap('Use as cover photo')
assert any('Photo 1 of 5' in (a or '') for a,b in labels())
node('Next photo');shot('photo-cover-changed');tap('Next photo')
actions();tap('Move photo later');assert any('Photo 3 of 5' in (a or '') for a,b in labels())
shot('photo-order-changed');tap('Previous photo')
actions();tap('Replace this photo');tap('Browse Files');pick_file('QA-photo-two.jpg');photo_count(5);shot('photo-replaced')
actions();tap('Remove this photo');tap('Cancel');photo_count(5)
tap('Remove this photo');tap('Remove photo');photo_count(4);shot('photo-removed')
tap('Close photo');tap('Open memory QA Samsung Photo Sweep');node('Edit memory');shot('photo-four-details')
print('Swipe, cover, immediate navigation, reorder, replace, removal cancel/confirm PASS',flush=True)
