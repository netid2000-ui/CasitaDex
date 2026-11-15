from phone import *
run('shell','am','force-stop',pkg);route('')
for theme in ['Light','Dark']:
 route('settings-manage?action=appearance');tap(theme+' appearance')
 route('photos');node('Add Photo Memory')
 anchor=bounds(node('Add Photo Memory'))
 tap('Compact photo view');assert node('Compact photo view').get('selected')=='true'
 tap('Sort photos');tap('Recently added');node('Sort photos, Recently added')
 tap('Grid photo view')
 run('shell','input','swipe','540','1800','540','900','300')
 assert bounds(node('Add Photo Memory'))==anchor
 route('photos')
 # Reopening preserves selected sort/view; choose a visible photo from the actual hierarchy.
 n=next(n for n in tree().iter('node') if n.get('content-desc','').startswith('View photo 1 of') and n.get('clickable')=='true')
 label=n.get('content-desc');originalBounds=bounds(node(label));shot('photo-'+theme+'-before-viewer');tap(label);node('Close photo')
 assert node('Zoom photo out').get('enabled')=='false'
 tap('Zoom photo in');assert node('Zoom photo out').get('enabled')=='true'
 shot('photo-'+theme+'-zoomed');tap('Reset photo zoom');assert node('Zoom photo out').get('enabled')=='false'
 # Double tap the image center, then verify the reset/zoom state.
 imageNode=next(n for n in tree().iter('node') if n.get('content-desc','').startswith('Photo 1 of'))
 x,y,a,b=bounds(imageNode);cx=str((x+a)//2);cy=str((y+b)//2)
 run('shell','input','tap',cx,cy);run('shell','input','tap',cx,cy)
 assert node('Zoom photo out').get('enabled')=='true'
 shot('photo-'+theme+'-double-tap');tap('Reset photo zoom')
 recording=subprocess.Popen([adb,'-s',serial,'shell','screenrecord','--time-limit','5','/sdcard/cd-pinch-'+theme+'.mp4'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 time.sleep(.5)
 run('shell','CLASSPATH=/data/local/tmp/casitadex-gesture-20261115.zip','app_process','/system/bin','CasitaDexPinch',cx,cy)
 assert node('Zoom photo out').get('enabled')=='true'
 shot('photo-'+theme+'-pinch');recording.wait(timeout=10);run('pull','/sdcard/cd-pinch-'+theme+'.mp4',str(out/('pinch-'+theme+'.mp4')));tap('Reset photo zoom')
 tap('Close photo');node('Add Photo Memory');returnedBounds=bounds(node(label));(out/('photo-'+theme+'-return-bounds.json')).write_text(json.dumps({'before':originalBounds,'after':returnedBounds},indent=2)+'\n');assert returnedBounds==originalBounds,(originalBounds,returnedBounds);shot('photo-'+theme+'-return')
 print(theme+' photo grid/compact/sort/sticky/viewer/zoom/double tap PASS',flush=True)
route('settings-manage?action=appearance');tap('System appearance');route('')
