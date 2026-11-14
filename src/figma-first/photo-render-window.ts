export type PhotoViewport={offset:number;height:number};
export type PhotoBounds={top:number;height:number};
/** One screen of overscan keeps nearby photos ready while distant images unmount. */
export function shouldRenderPhoto(bounds:PhotoBounds|undefined,viewport:PhotoViewport|undefined,index:number):boolean{
 if(!viewport)return true;
 if(!Number.isFinite(viewport.offset)||!Number.isFinite(viewport.height)||viewport.height<=0)return index<12;
 if(!bounds||!Number.isFinite(bounds.top)||!Number.isFinite(bounds.height)||bounds.height<=0)return index<12;
 const offset=Math.max(0,viewport.offset),height=viewport.height;
 return bounds.top+bounds.height>=Math.max(0,offset-height)&&bounds.top<=offset+height*2;
}
