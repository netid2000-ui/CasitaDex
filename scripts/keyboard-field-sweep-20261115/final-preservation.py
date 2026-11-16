source=open('scripts/keyboard-field-sweep-20261115/sweep.py').read();exec(source[:source.index("original=run('shell','settings'")])
hidekeyboard();run('shell','settings','put','system','font_scale','1.0');route('settings-manage?action=appearance');tap('System appearance');home();route('add')
t=tree();fields={n.get('content-desc'):n.get('text') for n in t.iter('node') if n.get('class','').endswith('EditText')}
assert fields.get('Memory name (Required)')=='',fields
assert fields.get('Description')=='',fields
shot('final-draft');(out/'draft.json').write_text(json.dumps({'status':'PASS','fields':fields},indent=2));home()
print('PASS original empty draft name and Description; returned Home',flush=True)
