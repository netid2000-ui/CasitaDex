import sys,json,os
from pathlib import Path
sys.path.insert(0,'scripts/samsung-sweep-20261115')
import phone
phone.out=Path('docs/qa/evidence/search-location-20261115/samsung-'+os.environ.get('QA_PHASE','after'));phone.out.mkdir(parents=True,exist_ok=True)
from phone import *
run('shell','am','force-stop',pkg);route('answers');fill('Search memories','QA Samsung Full Sweep 20261115');tap('Open regular memory QA Samsung Full Sweep 20261115')
assert any('Samsung 20x25x1 saved offline' in (a or '') for a,b in labels());shot('saved-memory')
route('photos');tap('View photo 1 of QA Samsung Photo Sweep full screen');assert any('Photo 1 of 4' in (a or '') for a,b in labels());shot('four-photos');tap('Close photo')
route('answers');fill('Search memories','QA Location Saved Memory');tap('Open regular memory QA Location Saved Memory');node('QA Picker Final Shelf');shot('saved-location')
route('')
settings={k:run('shell','settings','get',scope,k).decode().strip() for scope,k in [('system','font_scale'),('global','airplane_mode_on'),('global','wifi_on'),('global','mobile_data')]}
(out/'settings.json').write_text(json.dumps(settings,indent=2))
print('PASS original Samsung text, four photos, Location and settings',settings,flush=True)
