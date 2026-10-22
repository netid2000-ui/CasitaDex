import {Paths} from "expo-file-system";
import * as FileSystem from "expo-file-system/legacy";
import {measuredUsableSpace,requireStorageCapacity} from "./storage-safety";
export async function usableNativeSpace(){
 let available:number;
 try{available=await FileSystem.getFreeDiskStorageAsync();}
 catch(cause){throw Error("Storage measurement unavailable. Check device storage and retry; your saved data is kept.",{cause});}
 // SDK57 Paths uses File.freeSpace (includes reserved blocks); legacy uses StatFs.availableBlocksLong.
 return measuredUsableSpace(Paths.availableDiskSpace,available);
}
export async function requireNativeCapacity(required:number){
 requireStorageCapacity(await usableNativeSpace(),required);
}
