import type { createEngStore } from "./eng-store";
import type { EngSnapshot } from "./eng-types";
export const engEnabled=false;
export type EngStore=ReturnType<typeof createEngStore>;
export type EngBackup={snapshot:EngSnapshot;source:string;read:(path:string)=>Promise<Uint8Array>;reminders:import("./reminder-backup-v4").ReminderBackupSection|null};
export async function getEngStore():Promise<EngStore>{throw Error("Full ENG requires the native Development app");}
export function engPhotoUri(_path:string):string{throw Error("Native photo required");}
export async function chooseEngPhoto(_camera:boolean|"files"):Promise<Uint8Array|null>{throw Error("Native photo required");}
export async function writeEngBackup(_source:{snapshot:EngSnapshot;read:(path:string)=>Promise<Uint8Array>;hash:(bytes:Uint8Array)=>Promise<string>}):Promise<string>{throw Error("Full backup requires Android");}
export async function pickEngBackup():Promise<EngBackup|null>{throw Error("Full restore requires Android");}

export async function getEngStorage():Promise<{free:number;total:number;protectedBytes:number;referencedBytes:number;ownerCounts:Record<string,number>;cleanupAllowed:false;unreadable:number}>{throw Error("Native storage measurement required");}
export async function shareEngPhotos(_preview:{text:string;photos:import('./media-manifest').MediaEntry[]}):Promise<string>{throw Error('Photo sharing requires Android');}
export async function writeEngText(_text:string,_backup=false):Promise<string>{throw Error('Text export requires Android');}
