from phone import *
name='QA Samsung Lifecycle Reminder'
def rowbutton(title,label):
 node(title);t=tree();parents={c:p for p in t.iter() for c in p};n=next(n for n in t.iter('node') if n.get('text')==title)
 while not any(z.get('content-desc')==label or z.get('text')==label for z in n.iter('node')):n=parents[n]
 z=next(z for z in n.iter('node') if z.get('content-desc')==label);x,y,a,b=bounds(z)
 if not 60<y<b<2240:
  run('shell','input','swipe','550','1750','550','950','400');return rowbutton(title,label)
 run('shell','input','tap',str((x+a)//2),str((y+b)//2));time.sleep(.5)
route('');route('reminders-manage');rowbutton(name,'Manage reminder');node('Mark Complete');shot('reminder-incomplete-verified')
tap('Delete Reminder');tap('Cancel');node('Mark Complete');shot('reminder-delete-cancel')
tap('Delete Reminder');tap('Delete');route('');route('reminders-manage');assert not any(a==name for a,b in labels());shot('reminder-deleted')
print('Reminder incomplete state and delete cancel/confirm PASS',flush=True)
