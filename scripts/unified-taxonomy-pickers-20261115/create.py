import os
source=open('scripts/keyboard-field-sweep-20261115/sweep.py').read();exec(source[:source.index("original=run('shell','settings'")])
route('card?id=sb26qa_007');tap('Edit memory')
original=node('Choose Categories').get('content-desc')
for label,noun,name in [('Space','Space','QA Unified Workshop 20261115'),('Categories','Category','QA Unified Warranty 20261115'),('Location','Location','QA Unified Shelf 20261115')]:
 tap('Choose '+label);tap('Create new '+noun);tap(noun+' name')
 run('shell','input','text',name.replace(' ','%s'))
 # Save is in the fixed header; do not send Android Back through the modal.
 tap('Save '+noun.lower())
 if label=='Categories':tap('Done')
 assert name in node('Choose '+label).get('content-desc','')
 shot('created-'+noun)
 print('PASS native create and select '+noun,flush=True)
tap('Cancel');tap('Edit memory');assert node('Choose Categories').get('content-desc')==original;tap('Cancel');home()
print('PASS saved memory unchanged; three new reusable QA labels retained on emulator only',flush=True)
