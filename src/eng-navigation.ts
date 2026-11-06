import { Alert } from 'react-native';
const guardListeners = new Set<() => void>();
export function subscribeNavigationGuardChanges(listener: () => void) {
  guardListeners.add(listener);
  return () => { guardListeners.delete(listener); };
}
export function navigationIsGuarded() { return Boolean(guard?.check()); }
let guard:{check:()=>boolean;subject:string}|undefined;
export function registerEditGuard(check:()=>boolean,subject='memory'){
 const registered={check,subject};
 guard=registered;
 return ()=>{if(guard===registered){guard=undefined;Promise.resolve().then(()=>guardListeners.forEach(listener=>listener()));}};
}
export function guardedNavigate(action:()=>void){if(!guard?.check()){action();return;}Alert.alert('Keep your edits?',`Save or cancel your edits before leaving this ${guard.subject}.`,[{text:'Keep editing',style:'cancel'}]);}
