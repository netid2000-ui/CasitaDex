import subprocess,pathlib,json,hashlib,sqlite3
P=pathlib.Path
adb='/Volumes/FA-Development/Designs-by-FA/Android/Sdk/platform-tools/adb';pkg='com.designsbyfa.casitadex.refreshqa'
apk=P('/Volumes/FA-Development/Designs-by-FA/Development/CasitaDex/approved-editorial-android-qa-20261117/android/app/build/outputs/apk/release/app-release.apk');sha=hashlib.sha256(apk.read_bytes()).hexdigest();r={'sourceCommit':'a39c37f','package':pkg,'apkSha256':sha,'devices':{}}
for serial in ['emulator-5554','R5GL83X0K3N']:
 def run(*a):return subprocess.check_output([adb,'-s',serial,*a],text=True).strip()
 path=run('shell','pm','path',pkg).splitlines()[0].removeprefix('package:');actual=run('shell','sha256sum',path).split()[0];assert actual==sha
 r['devices'][serial]={'installedSha256':actual,'fontScale':run('shell','settings','get','system','font_scale'),'nightMode':run('shell','cmd','uimode','night')}
sim='81FC3CCE-ACEB-4957-BE61-C9C653A4CE56';bundle='com.designsbyfa.casitadex.plusstoreqa'
app=P(subprocess.check_output(['xcrun','simctl','get_app_container',sim,bundle,'app'],text=True).strip());r['ios']={'bundle':bundle,'installedJsSha256':hashlib.sha256((app/'main.jsbundle').read_bytes()).hexdigest(),'appearance':subprocess.check_output(['xcrun','simctl','ui',sim,'appearance'],text=True).strip(),'contentSize':subprocess.check_output(['xcrun','simctl','ui',sim,'content_size'],text=True).strip()}
json.dump(r,open('final-installed-identities.json','w'),indent=2);print(json.dumps(r,indent=2))
p=P(subprocess.check_output(['xcrun','simctl','get_app_container',sim,bundle,'data'],text=True).strip());c=sqlite3.connect(p/'Documents/SQLite/casitadex-development-v1.db');before=json.load(open('ios-tables-before.json'));changed=[]
for t,rows in before.items():
 after=[list(row) for row in c.execute('SELECT * FROM "'+t+'"')]
 if sorted(map(repr,rows))!=sorted(map(repr,after)):changed.append(t)
b=json.loads(before['eng_state_v2'][0][1]);a=json.loads(c.execute('select payload from eng_state_v2').fetchone()[0]);br=b.pop('revision');ar=a.pop('revision');m=json.load(open('ios-media-before.json'));missing=[f for f in m if not (p/f).exists()];altered=[f for f in m if (p/f).exists() and hashlib.sha256((p/f).read_bytes()).hexdigest()!=m[f]]
report={'tablesCompared':len(before),'changedTables':changed,'statePayloadEqualExceptRevision':a==b,'revisionBefore':br,'revisionAfter':ar,'mediaCompared':len(m),'missingMedia':missing,'alteredMedia':altered};json.dump(report,open('ios-data-preservation-final.json','w'),indent=2);print(report)
