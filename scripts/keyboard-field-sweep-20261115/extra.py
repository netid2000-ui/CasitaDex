# Uses the same measurement; loads helpers without running the main sweep.
import os
source=open('scripts/keyboard-field-sweep-20261115/sweep.py').read();exec(source[:source.index("original=run('shell','settings'")])
phone.out=Path('docs/qa/evidence/keyboard-field-sweep-20261115')/phone.serial/os.environ.get('QA_RUN','extra');phone.out.mkdir(parents=True,exist_ok=True);out=phone.out
original=run('shell','settings','get','system','font_scale').decode().strip()
try:
 for scale,theme in [('1.0','Light'),('2.0','Dark')]:
  run('shell','settings','put','system','font_scale',scale);time.sleep(3);route('settings-manage?action=appearance');tap(theme+' appearance')
  route('card?id=sb26qa_007')
  for noun,display in [('Space','Space'),('Category','Categories')]:
   tap('Edit '+display);tap('+ Create new '+noun+' ▾');probe('New '+noun+' name','details-new-'+noun.lower());route('');route('card?id=sb26qa_007')
  route('');route('card?id=sb26qa_001');probe('Next reminder (YYYY-MM-DD)','existing-memory-next-reminder')
  route('');route('card?id=sb26qa_007');tap('Choose verification status');probe('History note','history-note-retry')
finally:
 hidekeyboard();run('shell','settings','put','system','font_scale',original);time.sleep(3);route('settings-manage?action=appearance');tap('System appearance');route('add')
print('COMPLETE extras',flush=True)
