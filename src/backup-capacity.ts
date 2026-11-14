/** Technical format bounds, not a Plus allowance or a device capacity promise. */
import {mediaEntryLimit,mediaFileLimit} from "./media-manifest.ts";
export const draftPhotoLimit=5;
export const snapshotMetadataLimit=4_000_000;
export const reminderMetadataLimit=5_000_000;
// Every media frame remains uint32-sized; the archive offset is a safe JS integer.
export const streamedBackupLimit=20+snapshotMetadataLimit+reminderMetadataLimit+
  (mediaEntryLimit+draftPhotoLimit)*(mediaFileLimit+4);
export function assertStreamedBackupSize(size:number){
  if(!Number.isSafeInteger(size)||size<10||size>streamedBackupLimit)
    throw Error("Invalid or unsupported streamed backup size");
}
export function backupWorkingSpace(size:number){
  assertStreamedBackupSize(size);
  return size*2+snapshotMetadataLimit;
}
