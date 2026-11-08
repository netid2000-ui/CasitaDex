import type { Data } from "./model";
/** Media export/import currently requires Android Storage Access Framework. */
export async function saveMediaBackup(_environment:string,_data:Data):Promise<string>{throw Error("Full media backup is currently Android-only")}
export async function pickMediaBackup():Promise<{raw:Uint8Array;cardCount:number;imageCount:number}|null>{throw Error("Full media restore is currently Android-only")}
export async function restoreMediaBackup(_environment:string,_raw:Uint8Array):Promise<void>{throw Error("Full media restore is currently Android-only")}
export async function recoverMediaPrevious(_environment:string):Promise<void>{throw Error("Full media recovery is currently Android-only")}
