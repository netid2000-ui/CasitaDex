import { preflightPortableMediaContainer } from "./media-portable-container";
import type { Data } from "./model";
import type { MediaManifest } from "./media-manifest";
/** A single-use safety gate: no mutation before complete byte/hash preflight. */
export async function restoreVerifiedMediaContainer(
 raw:Uint8Array,
 sha256:(bytes:Uint8Array)=>Promise<string>,
 apply:(input:{text:Data;manifest:MediaManifest;readEntry:(path:string)=>Promise<Uint8Array>})=>Promise<void>,
):Promise<void>{
 const checked=await preflightPortableMediaContainer(raw,sha256);
 await apply({text:checked.preview.text,manifest:checked.preview.manifest,readEntry:checked.readEntry});
}
