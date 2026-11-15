from phone import *
tap('Large text');shot('in-app-large-text');route('');node('Add Memory');shot('in-app-large-home')
route('settings-manage');tap('Appearance & Accessibility');tap('Large text');tap('System appearance');shot('preferences-restored')
route('settings-manage?action=backup');tap('Review limited text backup (photos excluded)');node('Cancel text backup');shot('limited-backup-review');tap('Cancel text backup')
print('In-app Large text and limited text backup review/cancel PASS',flush=True)
