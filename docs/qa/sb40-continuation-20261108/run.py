from pathlib import Path
import importlib.util,subprocess,os,json
repo=Path('/Volumes/FA-Development/Designs-by-FA/Development/CasitaDex/sb40-authority-source-20261108')
out=Path(__file__).parent
s=importlib.util.spec_from_file_location('parity',repo/'scripts/parity/run-parity.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
env=dict(os.environ);env['JAVA_HOME']=str(m.BASE/'Tools/Temurin-17.0.21+9/jdk-17.0.21+9/Contents/Home');env['PATH']=env['JAVA_HOME']+'/bin:'+str(Path.home()/'.nvm/versions/node/v24.22.1/bin')+':'+str(m.BASE/'Android/Sdk/platform-tools')+':'+env['PATH'];env['ANDROID_HOME']=str(m.BASE/'Android/Sdk');env['ANDROID_AVD_HOME']=str(m.BASE/'Android/AVD');env['MAESTRO_CLI_NO_ANALYTICS']='true';env['TMPDIR']=str(m.BASE/'Tools/ParityTools/tmp');env['JAVA_TOOL_OPTIONS']='-Djava.io.tmpdir='+env['TMPDIR']
for platform,target in m.CONFIG['targets'].items():
 d=out/platform;d.mkdir(exist_ok=False)
 report={'sourceRevision':subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip(),'installedJavaScript':'2b2022f','functional':'NOT_RUN','scope':'core capture, inline editing, fictional create/find/reminder return, photo preview; not full release qualification'}
 try:
  report['identity']=m.gate(platform,target)
  command=[m.MAESTRO,'--device',target['device'],'test','--format','JUNIT','--output',str(d/'junit.xml'),'--debug-output',str(d/'debug'),'--test-output-dir',str(d/'artifacts'),'-e','APP_ID='+m.CONFIG['appId'],'-e','FIXTURE_TITLE=SB40 Parity continuation-final-'+platform+'-20261108',str(out/'regression.yaml')]
  with (d/'maestro.log').open('w') as log:ret=subprocess.run(command,env=env,cwd=repo,stdout=log,stderr=subprocess.STDOUT).returncode
  report['functional']='PASS' if ret==0 else 'FAIL';report['exitCode']=ret
 except Exception as e:report['functional']='BLOCKED';report['error']=str(e)
 (d/'report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report),flush=True)
