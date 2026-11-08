import fs from 'node:fs';import crypto from 'node:crypto';import path from 'node:path';import {createRequire} from 'node:module';import {pathToFileURL} from 'node:url';
const require=createRequire('/Volumes/FA-Development/Designs-by-FA/Tools/ParityTools/package.json');
const {PNG}=require('pngjs');const pixelmatch=(await import(pathToFileURL(require.resolve('pixelmatch')))).default;
const [referenceDir,candidateDir,platform]=process.argv.slice(2);
if(!referenceDir||!candidateDir||!['ios','android'].includes(platform))throw Error('Usage: compare-screens.mjs REFERENCE CANDIDATE ios|android');
const reference=JSON.parse(fs.readFileSync(path.join(referenceDir,'report.json'))),candidate=JSON.parse(fs.readFileSync(path.join(candidateDir,'report.json')));
if(reference.role!=='reference'||reference.functional!=='PASS'||candidate.role!=='candidate'||candidate.functional!=='PASS'||reference.platform!==platform||candidate.platform!==platform)throw Error('Verified same-platform reference and candidate required');
const config=JSON.parse(fs.readFileSync(new URL('./sb40-targets.json',import.meta.url)));
for(const [report,pin]of [[reference,config.references[platform]],[candidate,config.targets[platform]]]){
 if(report.identity?.status!=='PASS'||report.identity.appId!==config.appId)throw Error('Missing verified build identity');
 for(const key of ['executableSha256','bundleSha256','apkSha256'])if(pin[key]&&report.identity[key]!==pin[key])throw Error('Unapproved artifact fingerprint');
}
const results=[];
for(const name of ['home','add','inline-location']){
 const ar=fs.readFileSync(path.join(referenceDir,name+'.png')),br=fs.readFileSync(path.join(candidateDir,name+'.png'));
 if(crypto.createHash('sha256').update(ar).digest('hex')!==reference.captures[name]||crypto.createHash('sha256').update(br).digest('hex')!==candidate.captures[name])throw Error('Capture changed since verified run');
 const a=PNG.sync.read(ar),b=PNG.sync.read(br);
 if(a.width!==b.width||a.height!==b.height){results.push({name,status:'FAIL_DIMENSIONS',reference:[a.width,a.height],candidate:[b.width,b.height]});continue;}
 const masks=platform==='ios'?[[0,0,a.width,62],[Math.round(a.width*.68),62,Math.ceil(a.width*.32),95],[0,a.height-30,a.width,30]]:[[0,0,a.width,70],[Math.round(a.width*.68),70,Math.ceil(a.width*.32),210],[0,a.height-70,a.width,70]];
 for(const image of [a,b])for(const [x,y,w,h]of masks)for(let yy=y;yy<Math.min(y+h,a.height);yy++)for(let xx=x;xx<Math.min(x+w,a.width);xx++){const i=(yy*a.width+xx)*4;image.data[i]=image.data[i+1]=image.data[i+2]=255;image.data[i+3]=255;}
 const output=new PNG({width:a.width,height:a.height});const different=pixelmatch(a.data,b.data,output.data,a.width,a.height,{threshold:0.1,includeAA:false});
 const ratio=different/(a.width*a.height);const status=ratio<=0.001?'PASS':'REVIEW_REQUIRED';fs.writeFileSync(path.join(candidateDir,name+'-diff.png'),PNG.sync.write(output));results.push({name,status,differentPixels:different,diffRatio:ratio,maxDiffRatio:0.001,masks});
}
const report={platform,referenceDir,candidateDir,policy:'Compare each platform to its own accepted artifact; mask only status/date/system bars. Never auto-promote.',results,status:results.every(r=>r.status==='PASS')?'PASS':'REVIEW_REQUIRED'};
fs.writeFileSync(path.join(candidateDir,'visual-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));process.exitCode=report.status==='PASS'?0:1;
