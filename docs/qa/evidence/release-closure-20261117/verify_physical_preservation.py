from pathlib import Path
import sqlite3,json,hashlib
before=Path('iphone-documents-before');after=Path('iphone-documents-after')
a=sqlite3.connect(next(before.rglob('casitadex-development-v1.db')));b=sqlite3.connect(next(after.rglob('casitadex-development-v1.db')))
changes={}
for (t,) in a.execute("select name from sqlite_master where type='table'"):
 old=list(a.execute('select * from "'+t+'"'));new=list(b.execute('select * from "'+t+'"'))
 if sorted(map(repr,old))!=sorted(map(repr,new)):changes[t]={'beforeRows':len(old),'afterRows':len(new),'oldRowsStillPresent':all(r in new for r in old)}
s1=json.loads(a.execute('select payload from eng_state_v2').fetchone()[0]);s2=json.loads(b.execute('select payload from eng_state_v2').fetchone()[0]);r1=s1.pop('revision');r2=s2.pop('revision');media=[p for p in before.rglob('*') if p.suffix.lower() in ['.jpg','.jpeg','.png','.heic']];bad=[str(p.relative_to(before)) for p in media if not (after/p.relative_to(before)).exists() or hashlib.sha256(p.read_bytes()).digest()!=hashlib.sha256((after/p.relative_to(before)).read_bytes()).digest()]
r={'changedTables':changes,'stateUnchangedExceptRevision':s1==s2,'revisionBefore':r1,'revisionAfter':r2,'mediaCompared':len(media),'missingOrChangedMedia':bad};json.dump(r,open('physical-data-preservation.json','w'),indent=2);print(json.dumps(r,indent=2))
