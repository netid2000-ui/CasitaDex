import { Alert } from 'react-native';
let guard:{check:()=>boolean;subject:string}|undefined;
export function registerEditGuard(check:()=>boolean,subject='memory'){
 const registered={check,subject};
 guard=registered;
 return ()=>{if(guard===registered)guard=undefined;};
}
export function guardedNavigate(action:()=>void){if(!guard?.check()){action();return;}Alert.alert('Keep your edits?',`Save or cancel your edits before leaving this ${guard.subject}.`,[{text:'Keep editing',style:'cancel'}]);}
