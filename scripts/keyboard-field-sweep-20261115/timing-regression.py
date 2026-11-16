source=open('scripts/keyboard-field-sweep-20261115/sweep.py').read();exec(source[:source.index("original=run('shell','settings'")])
original=run('shell','settings','get','system','font_scale').decode().strip()
scale='2.0';theme='Dark'
try:
 run('shell','settings','put','system','font_scale',scale);time.sleep(2);route('settings-manage?action=appearance');tap('Dark appearance')
 route('reminders-manage?mode=new');tap('More options ▾')
 for i in range(3):probe('Notes','reminder-notes-repeat-'+str(i))
 tap('Cancel');route('add');tap('Edit Reference')
 for i in range(3):probe('Reference','add-reference-repeat-'+str(i))
finally:
 hidekeyboard();run('shell','settings','put','system','font_scale',original);route('settings-manage?action=appearance');tap('System appearance');route('')
assert all(r['status']=='PASS' for r in records),records
print('COMPLETE timing regression',flush=True)
