#!/usr/bin/env python3
"""Collect real local run results without treating missing checks as passes."""
from pathlib import Path
import json
root=Path('/Volumes/FA-Development/Designs-by-FA/QA-Evidence/Parity/CasitaDex')
rows=[]
for path in sorted(root.glob('*/*/*/report.json')):
 r=json.loads(path.read_text()); rows.append({k:r.get(k) for k in ['runId','platform','role','flow','identity','functional','visual','error']})
visual=[]
for path in sorted(root.glob('*/*/*/visual-report.json')):
 r=json.loads(path.read_text());visual.append({'platform':r['platform'],'status':r['status'],'results':r['results']})
report={'runs':rows,'visualComparisons':visual,'accessibility':{'appleInspector':'AVAILABLE_NOT_AUDITED','googleScanner':json.loads(Path(__file__).with_name('scanner-status.json').read_text())},'calibrationRecovery':'Exact synthetic iOS v2 draft completed through native UI after Open-link confirmation; no state reset', 'scope':'CasitaDex pinned SB40 only; Event Command not yet calibrated. Missing checks are not passes.'}
out=Path(__file__).resolve().parents[2]/'docs/qa/parity-20261108';out.mkdir(exist_ok=True)
(out/'results.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
