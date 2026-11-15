from phone import *
schedule=[]
for mode,mid in [('Foreground','sb26qa_001'),('Background','sb26qa_007'),('Terminated','sb26qa_013')]:
 route('reminders-manage?mode=new&memoryId='+mid)
 fill('Reminder title (Required)','QA Samsung '+mode+' Alert')
 values=[b for a,b in labels() if re.fullmatch(r'\d{4}-\d{2}-\d{2}|\d{1,2}:\d{2}\s[AP]M',b or '')]
 shot('scheduled-'+mode)
 tap('Save Reminder');node('Edit memory')
 schedule.append({'mode':mode,'memoryId':mid,'title':'QA Samsung '+mode+' Alert','displayedDue':values})
 (out/'notification-schedule.json').write_text(json.dumps(schedule,indent=2)+'\n')
 print('Scheduled '+mode+' linked reminder',flush=True)
