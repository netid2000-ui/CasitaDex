source=open('scripts/keyboard-field-sweep-20261115/sweep.py').read();exec(source[:source.index("original=run('shell','settings'")])
original=run('shell','settings','get','system','font_scale').decode().strip();scale='2.0';theme='Dark'
try:
 run('shell','settings','put','system','font_scale',scale);time.sleep(2);route('settings-manage?action=appearance');tap('Dark appearance')
 home();route('card?id=sb26qa_001');probe('Next reminder (YYYY-MM-DD)','existing-memory-next-reminder')
 home();route('card?id=sb26qa_007');tap('Choose verification status');probe('History note','history-note-retry')
finally:
 hidekeyboard();run('shell','settings','put','system','font_scale',original);route('settings-manage?action=appearance');tap('System appearance');home()
assert len(records)==2 and all(r['status']=='PASS' for r in records),records
print('COMPLETE remaining edge checks',flush=True)
