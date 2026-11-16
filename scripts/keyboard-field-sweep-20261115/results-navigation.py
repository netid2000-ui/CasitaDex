import os
source=open('scripts/keyboard-field-sweep-20261115/sweep.py').read();exec(source[:source.index("original=run('shell','settings'")])
original=run('shell','settings','get','system','font_scale').decode().strip()
try:
 for scale,theme in [('1.0','Light'),('2.0','Dark')]:
  run('shell','settings','put','system','font_scale',scale);time.sleep(2);route('settings-manage?action=appearance');tap(theme+' appearance');route('');route('answers')
  fill('Search memories','filter');tap('With photos only')
  result=next(n.get('content-desc') for n in tree().iter('node') if n.get('content-desc','').startswith('Open photo memory'));tap(result)
  headers=[bounds(node(label,False)) for label in ['‹ Results','Edit memory','More ···']]
  for i,a in enumerate(headers):
   for b in headers[i+1:]:assert a[2]<=b[0] or b[2]<=a[0] or a[3]<=b[1] or b[3]<=a[1],('Header touch areas overlap',headers)
  shot(scale+'-results-header');tap('Edit Reference');probe('Reference','results-reference')
  tap('Reference');time.sleep(1)
  n=node('‹ Results',False);assert bounds(n)[3]<1500
  shot(scale+'-results-with-keyboard');tap('‹ Results');hidekeyboard()
  assert node('Search memories').get('text')=='filter';assert node('With photos only').get('selected')=='true'
  shot(scale+'-results-return');records.append({'case':'results-header-keyboard-return','scale':scale,'status':'PASS','headerBounds':headers});save()
  route('');route('answers');tap('Next');before=next(n.get('content-desc') for n in tree().iter('node') if n.get('content-desc','').startswith('Open '));tap(before);tap('‹ Results')
  assert any('Page 2 of' in (n.get('text') or '') for n in tree().iter('node'));assert node(before,False)
  shot(scale+'-page-two-return');records.append({'case':'results-page-two-return','scale':scale,'status':'PASS'});save()
finally:
 hidekeyboard();run('shell','settings','put','system','font_scale',original);route('settings-manage?action=appearance');tap('System appearance');route('')
print('COMPLETE results navigation',flush=True)
