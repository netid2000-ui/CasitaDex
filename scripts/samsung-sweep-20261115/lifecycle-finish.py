from phone import *
tap('Cancel');node('Edit memory');shot('delete-cancel')
tap('More ···');tap('Move to Recently Deleted');tap('Move to Recently Deleted')
node('Restore memory');shot('recently-deleted')
tap('Restore memory');node('Edit memory');shot('restored')
print('Memory lifecycle PASS',flush=True)
