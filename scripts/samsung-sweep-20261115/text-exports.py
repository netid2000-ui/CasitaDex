from phone import *
def export(label,expected,screen):
 tap(label);tap('Use this folder');tap('Allow');time.sleep(1)
 assert any(expected in (a or '') for a,b in labels());shot(screen)
route('settings-manage?action=backup');export('Save text report (no photos; not a backup)','Text report saved and verified.','text-report-exported')
tap('Review limited text backup (photos excluded)');export('Confirm save limited text backup','Limited text backup saved and verified.','limited-text-backup-exported')
files=run('shell','ls','/sdcard/Documents/CasitaDex-QA-20261115').decode().splitlines();reports=[f for f in files if f.startswith('CasitaDex-text-report-')];backups=[f for f in files if f.startswith('CasitaDex-text-backup-')]
assert reports and backups
for f in [reports[-1],backups[-1]]:
 data=run('shell','cat','/sdcard/Documents/CasitaDex-QA-20261115/'+f);json.loads(data);(out/f).write_bytes(data)
print('Readable text report and limited text backup export/readback PASS',flush=True)
