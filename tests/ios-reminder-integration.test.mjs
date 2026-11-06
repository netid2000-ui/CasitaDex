import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { verifyIosReminderIntegration } from '../scripts/verify-ios-reminder-integration.mjs';

const lock='PODS:\n  - CasitaDexReminderAlerts (1.0.0):\n    - ExpoModulesCore\nDEPENDENCIES:\n  - CasitaDexReminderAlerts\n';
const provider=`internal import ExpoModulesCore
internal import CasitaDexReminderAlerts
class ExpoModulesProvider: ModulesProvider {
 public override func getModuleClasses() -> [ExpoModuleTupleType] {
  return [(module: CasitaDexReminderAlertsModule.self, name: nil)]
 }
 public override func getAppDelegateSubscribers() -> [ExpoAppDelegateSubscriber.Type] {
  return [CasitaDexReminderAlertsAppDelegateSubscriber.self]
 }
}`;
function fixture(fn, { pod=lock, swift=provider }={}) {
 const ios=mkdtempSync(join(tmpdir(),'casitadex-integration-'));
 try {
  const dir=join(ios,'Pods/Target Support Files/Pods-CasitaDexDev');mkdirSync(dir,{recursive:true});
  if(pod!==null)writeFileSync(join(ios,'Podfile.lock'),pod);
  if(swift!==null)writeFileSync(join(dir,'ExpoModulesProvider.swift'),swift);
  return fn(ios);
 }finally{rmSync(ios,{recursive:true,force:true});}
}
test('valid generated pod, module and subscriber pass',()=>fixture(ios=>assert.equal(verifyIosReminderIntegration(ios).ok,true)));
for(const [label,options,message] of [
 ['missing pod registration',{pod:lock.replace('  - CasitaDexReminderAlerts (1.0.0):\n    - ExpoModulesCore\n','')},/PODS section/],
 ['missing import',{swift:provider.replace('internal import CasitaDexReminderAlerts','')},/missing import/],
 ['missing module',{swift:provider.replace('(module: CasitaDexReminderAlertsModule.self, name: nil)','')},/getModuleClasses/],
 ['missing subscriber',{swift:provider.replace('return [CasitaDexReminderAlertsAppDelegateSubscriber.self]','return []')},/getAppDelegateSubscribers/],
 ['missing generated files',{pod:null,swift:null},/Cannot read/],
 ['commented module',{swift:provider.replace('(module: CasitaDexReminderAlertsModule.self, name: nil)','/* CasitaDexReminderAlertsModule.self */')},/getModuleClasses/],
 ['subscriber placed in wrong method',{swift:provider.replace('return [CasitaDexReminderAlertsAppDelegateSubscriber.self]','return []').replace('name: nil)','name: nil), CasitaDexReminderAlertsAppDelegateSubscriber.self')},/getAppDelegateSubscribers/],
]) test(label+' fails closed',()=>fixture(ios=>{const result=verifyIosReminderIntegration(ios);assert.equal(result.ok,false);assert.match(result.errors.join('\n'),message);},options));
test('CLI accepts explicit iOS directory and exits nonzero on integration failure',()=>{
 fixture(ios=>{const result=spawnSync(process.execPath,['scripts/verify-ios-reminder-integration.mjs',ios],{encoding:'utf8'});assert.equal(result.status,0);assert.match(result.stdout,/PASS/);});
 fixture(ios=>{const result=spawnSync(process.execPath,['scripts/verify-ios-reminder-integration.mjs',ios],{encoding:'utf8'});assert.equal(result.status,1);assert.match(result.stderr,/No files were changed/);},{swift:null});
});
