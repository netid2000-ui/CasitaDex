source=open('scripts/keyboard-field-sweep-20261115/sweep.py').read();exec(source[:source.index("original=run('shell','settings'")])
hidekeyboard();run('shell','settings','put','system','font_scale','1.0');time.sleep(3);run('shell','am','force-stop',pkg);route('');time.sleep(2);route('settings-manage?action=appearance');tap('System appearance');shot('appearance-restored');home();route('add')
t=tree();fields={n.get('content-desc'):n.get('text') for n in t.iter('node') if n.get('class','').endswith('EditText')}
assert fields.get('Memory name (Required)')=='',fields
assert fields.get('Description')=='',fields
shot('final-draft');(out/'draft.json').write_text(json.dumps({'status':'PASS','fields':fields},indent=2));home()
print('PASS original empty draft name and Description; returned Home',flush=True)

settings={k:run('shell','settings','get',scope,k).decode().strip() for scope,k in [('system','font_scale'),('global','airplane_mode_on'),('global','wifi_on'),('global','mobile_data')]}
assert settings=={'font_scale':'1.0','airplane_mode_on':'0','wifi_on':'1','mobile_data':'1'},settings
(out/'settings.json').write_text(json.dumps(settings,indent=2))
shot('final-home')
