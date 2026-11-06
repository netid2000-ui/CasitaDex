const fs=require('node:fs'),path=require('node:path');
const required=['metro-guard','metro-probe-ios','metro-node-ios','hermes-compile-ios','metro-probe-android','metro-node-android','hermes-compile-android','export-web','export-native'];
function summarize(read){
 const stages=[];
 for(const name of required){const result=read(name);stages.push({name,status:result.exit===0?'PASS':'FAIL',exit:result.exit??null});}
 for(const platform of ['ios','android']){
  const name='hermes-exec-'+platform,result=read(name);
  const unsupported=result.exit!==0 && typeof result.log==='string' && result.log.includes('hermesc does not support -exec.');
  stages.push({name,status:unsupported?'NOT_RUN':result.exit===0?'PASS':'FAIL',exit:result.exit??null,...(unsupported?{reason:'Installed hermesc is compiler-only; native runtime acceptance remains open'}:{})});
 }
 return {ok:!stages.some(s=>s.status==='FAIL'),nativeRuntimeAccepted:false,stages};
}
const parseExit = text => /^(0|[1-9][0-9]*)$/.test(text.trim()) ? Number(text.trim()) : null;
module.exports={required,summarize,parseExit};
if(require.main===module){
 const dir=path.resolve(process.argv[2]);const result=summarize(name=>{
  try{return {exit:parseExit(fs.readFileSync(path.join(dir,name+'.exit'),'utf8')),log:fs.readFileSync(path.join(dir,name+'.log'),'utf8')};}catch{return {};}
 });fs.writeFileSync(path.join(dir,'metro-summary.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=1;
}
