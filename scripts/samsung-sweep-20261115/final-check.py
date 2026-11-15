from phone import *
subprocess.run([adb,'-s',serial,'shell','pm','revoke',pkg,'android.permission.CAMERA'],capture_output=True)
run('shell','am','force-stop',pkg);route('answers');fill('Search memories','QA Samsung Full Sweep 20261115');tap('Open regular memory QA Samsung Full Sweep 20261115')
assert any('Samsung 20x25x1 saved offline' in (a or '') for a,b in labels());shot('final-restart-memory')
route('photos');tap('View photo 1 of QA Samsung Photo Sweep full screen');assert any('Photo 1 of 4' in (a or '') for a,b in labels());shot('final-restart-four-photos');tap('Close photo')
route('answers');fill('Search memories','QA Location Saved Memory');tap('Open regular memory QA Location Saved Memory');node('QA Picker Final Shelf');shot('final-restart-location')
route('');shot('final-home')
settings={k:run('shell','settings','get',scope,k).decode().strip() for scope,k in [('system','font_scale'),('global','airplane_mode_on'),('global','wifi_on'),('global','mobile_data')]}
assert settings=={'font_scale':'1.0','airplane_mode_on':'0','wifi_on':'1','mobile_data':'1'},settings
(out/'final-device-settings.json').write_text(json.dumps(settings,indent=2)+'\n')
exitinfo=run('shell','dumpsys','activity','exit-info',pkg).decode();(out/'final-app-exit-info.txt').write_text(exitinfo)
crashes=run('logcat','-b','crash','-d').decode();(out/'final-crash-review.json').write_text(json.dumps({'appPackage':pkg,'packageMentionedInCrashBuffer':pkg in crashes,'note':'Crash buffer was not cleared; read-only check.'},indent=2)+'\n')
print('Final cold restart, text, four photos, Location and restored device settings PASS',flush=True)
