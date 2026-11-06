// Test-only vulnerable oracle. Never import into application code; corpus is bounded.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const dir=path.join(__dirname,'../fixtures/decoder-legacy');
module.exports=function compare(candidate=require('query-string')) {
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
 for(const [file,entry] of Object.entries(manifest))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,file))).digest('hex'),entry.sha256,'Frozen oracle hash: '+file);
 const oldDecoder=require(path.join(dir,'decode-uri-component.cjs')),moduleObject={exports:{}};
 vm.runInNewContext(fs.readFileSync(path.join(dir,'query-string.cjs'),'utf8'),{module:moduleObject,exports:moduleObject.exports,require:s=>s==='decode-uri-component'?oldDecoder:require(s)},{timeout:1000});
 const old=moduleObject.exports;
 const corpus=['','+','%2B','%','%GG','%C2','%FE%FF','%FF%FE','%fe%ff','%E0%A4%A','%2541x%41%zz','%C2%41','%C2%C2','%C0%AF','%ED%A0%80','%F4%90%80%80','%C3%A9','%F0%9F%8F%A0','café 日本 🏠','a/b?c&d#e+f'];
 for(let a=0;a<256;a++)corpus.push('%'+a.toString(16).padStart(2,'0'));
 for(let i=0;i<1000;i++)corpus.push('%'+((i*41)%256).toString(16).padStart(2,'0')+'%'+((i*67)%256).toString(16).padStart(2,'0')+'%zz');
 let checked=0;const differences=[];
 for(const input of corpus)for(const kind of ['query','fragment','encoded-identity']){
  const run=q=>kind==='query'?q.parse('x='+input):kind==='fragment'?q.parseUrl('/r#'+input,{parseFragmentIdentifier:true}):q.parse(q.stringify({x:input}));
  const before=JSON.stringify(run(old)),after=JSON.stringify(run(candidate));checked++;
  if(before!==after)differences.push({kind,input,before,after});
 }
 const allowed=[{kind:'query',input:'%2541x%41%zz',before:'{"x":"AxA%zz"}',after:'{"x":"%41xA%zz"}'},{kind:'fragment',input:'%2541x%41%zz',before:'{"url":"/r","query":{},"fragmentIdentifier":"AxA%zz"}',after:'{"url":"/r","query":{},"fragmentIdentifier":"%41xA%zz"}'}];
 assert.equal(checked,3828);assert.deepEqual(differences,allowed,'Unexpected decoder semantic delta or missing intended single-decode behavior');
 return {checked,matched:checked-differences.length,allowedDifferences:differences};
};
if(require.main===module)console.log(JSON.stringify(module.exports(),null,2));
