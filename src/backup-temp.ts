/** Only SDK-owned picker copies and explicitly named app cache files may be disposed. */
function stripEnd(uri:string){return uri.replace(/\/+$/,"");}
export function isPickerCacheCopy(uri:string,cache:string){
 const prefix=stripEnd(cache)+"/DocumentPicker/";
 if(!cache||!uri.startsWith(prefix))return false;
 const name=uri.slice(prefix.length);
 try{const decoded=decodeURIComponent(name);return !!decoded&&!/[\\/]/.test(decoded)&&decoded!=="."&&decoded!=="..";}catch{return false;}
}
export function backupTempName(kind:"check"|"review",now=Date.now(),suffix=Math.random().toString(36).slice(2)){
 return (kind==="check"?"eng-backup-check-":"eng-restore-review-")+now+"-"+suffix+".cdxe";
}
export function isStaleBackupTemp(name:string,now=Date.now()){
 const match=/^eng-(?:backup-check|restore-review)-(\d{13})-[a-z0-9]+\.cdxe$/.exec(name);
 return !!match&&now-Number(match[1])>=24*60*60*1000;
}
