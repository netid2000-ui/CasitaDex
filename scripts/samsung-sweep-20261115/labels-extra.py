from phone import *
for noun,tab in [('Space','Spaces'),('Category','Categories')]:
 name='QA Samsung '+noun
 renamed=name+' Renamed'
 route('settings-manage?action=labels');tap(tab);tap('Create new label')
 fill(noun+' name',name);tap('Save');tap(name)
 tap('Rename ›');fill(noun+' name',renamed);tap('Save');tap('Review removal ›')
 shot('label-'+noun+'-impact');tap('Cancel label removal')
 run('shell','am','force-stop',pkg);route('settings-manage?action=labels');tap(tab);tap(renamed)
 tap('Review removal ›');tap('Confirm remove label only')
 assert not any(n.get('content-desc')==renamed for n in tree().iter('node'))
 shot('label-'+noun+'-removed');print(noun+' create/rename/restart/removal cancel/confirm PASS',flush=True)
