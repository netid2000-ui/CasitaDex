import os,sys,time,json
from pathlib import Path
sys.path.insert(0,'scripts/samsung-sweep-20261115')
import phone
phone.serial=os.environ.get('QA_SERIAL','emulator-5554');phone.out=Path('docs/qa/evidence/search-location-20261115')/phone.serial/'context';phone.out.mkdir(parents=True,exist_ok=True)
from phone import *
route('answers');fill('Search memories','filter');tap('With photos only')
result=next(n.get('content-desc') for n in tree().iter('node') if n.get('content-desc','').startswith('Open photo memory'))
tap(result);tap('‹ Results');assert node('Search memories').get('text')=='filter';assert node('With photos only').get('selected')=='true';shot('query-photo-return')
tap('Clear search');tap('With photos only');tap('Next');before=[(n.get('content-desc'),bounds(n)) for n in tree().iter('node') if n.get('content-desc','').startswith('Open ')]
assert before[0][1][1]>=bounds(node('With photos only'))[3],('First result hidden by sticky filters',before[0]);shot('page-two-first-result-visible');result=before[0][0];tap(result);node('‹ Results',False);tap('‹ Results');assert any('Page 2 of' in (a or '') for a,b in labels());shot('page-two-return')
route('');print('PASS query + photo filter and page two return context')
