from phone import *
name='QA Samsung Full Sweep 20261115'
route('settings-manage?action=backup');tap('Choose backup to review');tap('CasitaDex-full-2026-11-15T20-57-37-417Z.cdxe')
tap('Use backed-up draft (previous state recoverable)');tap('Confirm replace with reviewed backup');time.sleep(2)
assert any('Full collection restored and verified.' in (a or '') for a,b in labels());shot('full-backup-restored')
route('answers');fill('Search memories',name);tap('Open regular memory '+name)
assert any('Samsung 20x25x1 saved offline' in (a or '') for a,b in labels());shot('restored-original-description')
route('photos');tap('View photo 1 of QA Samsung Photo Sweep full screen')
assert any('Photo 1 of 4' in (a or '') for a,b in labels());shot('restored-four-photos');tap('Close photo')
route('settings-manage?action=backup');tap('Choose backup to review');tap('QA-corrupt.cdxe');shot('malformed-backup-rejected');print(labels(),flush=True)
print('Full backup restore original text and four photos PASS; inspect invalid backup rejection',flush=True)
