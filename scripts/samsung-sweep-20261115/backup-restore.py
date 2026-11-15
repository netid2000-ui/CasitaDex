from phone import *
name='QA Samsung Full Sweep 20261115'
backup='CasitaDex-full-2026-11-15T20-57-37-417Z.cdxe'
route('answers');fill('Search memories',name);tap('Open regular memory '+name)
tap('Edit memory');fill('Description','QA changed AFTER full backup');tap('Save');shot('backup-after-edit')
route('settings-manage?action=backup');tap('Choose backup to review');tap(backup)

if any(b=='Use backed-up draft (previous state recoverable)' for a,b in labels()):tap('Use backed-up draft (previous state recoverable)')
tap('Confirm replace with reviewed backup');time.sleep(2);shot('full-backup-restored');print(labels(),flush=True)
route('answers');fill('Search memories',name);tap('Open regular memory '+name)
assert any('Samsung 20x25x1 saved offline' in (a or '') for a,b in labels())
shot('restored-original-description')
route('photos');tap('View photo 1 of QA Samsung Photo Sweep')
assert any('Photo 1 of 4' in (a or '') for a,b in labels());shot('restored-four-photos');tap('Close photo')
print('Full backup restore restored original text and four-photo collection PASS',flush=True)
