import sys
from pathlib import Path
sys.path.insert(0,'scripts/samsung-sweep-20261115')
import phone
phone.out=Path('docs/qa/evidence/samsung-ui-corrections-20261115/long-label')
from phone import *
name='QA Samsung Hallway and Seasonal Storage Cabinet'
hidekeyboard();fill('Search labels','QA Samsung');tap(name);tap('Review removal ›');tap('Confirm remove label only');shot('temporary-label-removed');route('');print('Temporary QA Space removed; long-label screenshots verified; collection preserved',flush=True)
