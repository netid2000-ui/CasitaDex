from harness import *
import sys
mode=sys.argv[1];original={k:a('shell','settings','get','system',k).strip() for k in ['font_scale','accelerometer_rotation','user_rotation']};(out/(mode+'-settings-before.json')).write_text(json.dumps(original));report={'mode':mode,'installedSource':m.CONFIG['sourceCommit'],'status':'NOT_RUN'}
try:
 if 'large' in mode:a('shell','settings','put','system','font_scale','2.0')
 else:
  a('shell','settings','put','system','accelerometer_rotation','0');a('shell','settings','put','system','user_rotation','1')
 time.sleep(1);capture(mode+'-current');ns=tree()
 if match(ns,'Close photo'):tap('Close photo')
 if not match(tree(),'Grid photo view'):
  tap('CasitaDex logo, go to Home');tap('Photos')
 time.sleep(1);capture(mode+'-photos');ns=tree();controls={}
 toolbarY=None
 for label in ['Add Photo Memory','Grid photo view','Compact photo view','Recently updated','Recently added']:
  for attempt in range(16):
   matches=match(ns,label,'Button')
   if matches and box(matches[0])[2]-box(matches[0])[0]>=126 and box(matches[0])[0]>=10 and box(matches[0])[2]<=max(box(n)[2] for n in ns)-10 and box(matches[0])[3]>box(matches[0])[1]:
    controls[label]=box(matches[0]);break
   assert toolbarY is not None,'Toolbar unavailable'
   a('shell','input','swipe','900',str(toolbarY),'650',str(toolbarY),'400');ns=tree()
  assert label in controls,'Control unreachable '+label
  toolbarY=(controls[label][1]+controls[label][3])//2
 for _ in range(3):a('shell','input','swipe','150',str(toolbarY),'950',str(toolbarY),'300')
 ns=tree();scroll=[box(n) for n in ns if n.get('class')=='android.widget.ScrollView'];photos=[box(n) for n in ns if n.get('content-desc','').startswith('View photo 1 of ')]
 if not any(b[3]-b[1]>=120 for b in photos):
  viewport=next(b for b in scroll if b[3]-b[1]>=120);a('shell','input','swipe','540',str(viewport[3]-15),'540',str(viewport[1]+15),'500');ns=tree();photos=[box(n) for n in ns if n.get('content-desc','').startswith('View photo 1 of ')]
 report.update(controls=controls,scrollBounds=scroll,photoBounds=photos)
 assert photos,'No photo region exposed';assert any(b[3]-b[1]>=120 for b in photos),'No usable visible thumbnail height after gallery scroll'
 capture(mode+'-gallery-scrolled')
 report['status']='PASS_BOUNDS_ONLY'
except Exception as e:report.update(status='FAIL',error=str(e))
finally:
 for k,v in original.items():
  if v=='null':a('shell','settings','delete','system',k)
  else:a('shell','settings','put','system',k,v)
 time.sleep(.5);report['settingsRestored']={k:a('shell','settings','get','system',k).strip() for k in original}==original;(out/(mode+'-report.json')).write_text(json.dumps(report,indent=2));print(json.dumps(report))
