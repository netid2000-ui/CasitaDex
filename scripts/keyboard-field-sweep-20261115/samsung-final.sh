#!/bin/bash
set -e
python3 - <<'PY'
import json
for suffix,count in [('final-scroll',29),('final-extra',8),('final-results-r3',6)]:
 a=json.load(open('docs/qa/evidence/keyboard-field-sweep-20261115/emulator-5554/'+suffix+'/results.json'))
 assert len(a)==count and all(r['status']=='PASS' for r in a),(suffix,a)
print('Emulator gates passed')
PY
/Volumes/FA-Development/Designs-by-FA/Android/QA-Tools/platform-tools-36.0.2/platform-tools/adb -s R5GL83X0K3N install --no-streaming -r ../approved-refresh-android-qa-20261115/android/app/build/outputs/apk/release/app-release.apk > docs/qa/evidence/keyboard-field-sweep-20261115/samsung-install.txt 2>&1
QA_SERIAL=R5GL83X0K3N QA_RUN=final-scroll python3 scripts/keyboard-field-sweep-20261115/sweep.py > docs/qa/evidence/keyboard-field-sweep-20261115/samsung-final-scroll.txt 2>&1
QA_SERIAL=R5GL83X0K3N QA_RUN=final-extra python3 scripts/keyboard-field-sweep-20261115/extra.py > docs/qa/evidence/keyboard-field-sweep-20261115/samsung-extra.txt 2>&1
QA_SERIAL=R5GL83X0K3N QA_RUN=final-results python3 scripts/keyboard-field-sweep-20261115/results-navigation.py > docs/qa/evidence/keyboard-field-sweep-20261115/samsung-results.txt 2>&1
QA_SERIAL=R5GL83X0K3N QA_RUN=final-native-pickers python3 scripts/keyboard-field-sweep-20261115/native-pickers.py > docs/qa/evidence/keyboard-field-sweep-20261115/samsung-native-pickers.txt 2>&1
QA_PHASE=keyboard-after python3 scripts/search-location-20261115/persistence.py > docs/qa/evidence/keyboard-field-sweep-20261115/samsung-after.txt 2>&1
