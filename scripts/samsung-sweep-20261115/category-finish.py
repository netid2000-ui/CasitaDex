from phone import *
name='QA Samsung Category';renamed=name+' Renamed'
tap(name);tap('Rename ›');fill('Category name',renamed);tap('Save');tap('Review removal ›');shot('label-Category-impact');tap('Cancel label removal')
run('shell','am','force-stop',pkg);route('settings-manage?action=labels');tap('Categories');tap(renamed);tap('Review removal ›');tap('Confirm remove label only')
assert not any(n.get('content-desc')==renamed for n in tree().iter('node'));shot('label-Category-removed');print('Category create/rename/restart/removal cancel/confirm PASS',flush=True)
