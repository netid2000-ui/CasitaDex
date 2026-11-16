source=open('scripts/keyboard-field-sweep-20261115/sweep.py').read();exec(source[:source.index("original=run('shell','settings'")])
original=run('shell','settings','get','system','font_scale').decode().strip();scale='2.0';theme='Dark'
try:
 run('shell','settings','put','system','font_scale',scale);run('shell','am','force-stop',pkg);route('settings-manage?action=appearance');tap('Dark appearance');route('card?id=sb26qa_007');tap('Choose verification status')
 assert any(n.get('content-desc')=='Close verification choices' for n in tree().iter('node')),'Verification panel did not open'
 probe('History note','history-note-retry')
except Exception:
 shot('history-diagnostic');raise
finally:
 hidekeyboard();run('shell','settings','put','system','font_scale',original);route('settings-manage?action=appearance');tap('System appearance');home()
assert len(records)==1 and records[0]['status']=='PASS',records
print('COMPLETE history',flush=True)
