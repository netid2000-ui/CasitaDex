/** Web does not yet support local private media. */
export async function listCardImages(_environment:string,_cardId:string):Promise<{id:string;uri:string}[]>{return []}
export async function pickAndAttachImage(_environment:string,_cardId:string):Promise<boolean>{throw Error("Image attachments require the native app")}
export async function removeCardImage(_environment:string,_cardId:string,_imageId:string):Promise<void>{throw Error("Image attachments require the native app")}
