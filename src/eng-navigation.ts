import { Alert } from 'react-native';
let guard:(()=>boolean)|undefined;
export function registerEditGuard(check:()=>boolean){guard=check;return ()=>{if(guard===check)guard=undefined;};}
export function guardedNavigate(action:()=>void){if(!guard?.()){action();return;}Alert.alert('Keep your edits?','Save or cancel your edits before leaving this memory.',[{text:'Keep editing',style:'cancel'}]);}
