/** Web does not own native photo files. */
export async function photoThumbnail(uri:string):Promise<string>{return uri;}
export async function thumbnailStorageBytes():Promise<number>{return 0;}
