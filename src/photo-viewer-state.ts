/** Viewer state is local only: navigation never reorders, writes or removes media. */
export function clampPhotoIndex(index:number,count:number):number {
  return Math.max(0,Math.min(Math.max(0,count-1),Number.isFinite(index)?Math.trunc(index):0));
}
export function clampPhotoZoom(zoom:number):number {
  return Math.max(1,Math.min(4,Number.isFinite(zoom)?zoom:1));
}
export function photoSwipeStep(dx:number,dy:number,zoom:number):number {
  if(zoom!==1||!Number.isFinite(dx)||!Number.isFinite(dy)||Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*1.5)return 0;
  return dx<0?1:-1;
}
export function touchDistance(touches:readonly {pageX:number;pageY:number}[]):number|null {
  if(touches.length<2)return null;
  const value=Math.hypot(touches[1].pageX-touches[0].pageX,touches[1].pageY-touches[0].pageY);
  return Number.isFinite(value)&&value>0?value:null;
}

/** Double-tap is a bounded two-press gesture; false positives must not trigger on swipes. */
export type PhotoTap={time:number;x:number;y:number};
export function isPhotoDoubleTap(previous:PhotoTap|null,current:PhotoTap,maxDelay=300,maxDistance=30):boolean {
  return previous!==null&&Number.isFinite(current.time)&&Number.isFinite(previous.time)&&
    current.time>=previous.time&&current.time-previous.time<=maxDelay&&
    Math.hypot(current.x-previous.x,current.y-previous.y)<=maxDistance;
}
export function doubleTapPhotoZoom(zoom:number):number {
  return clampPhotoZoom(zoom)>1?1:2;
}
/** Keep every edge of the enlarged image reachable; never pan outside the image bounds. */
export function clampPhotoPan(
  x:number,y:number,zoom:number,width:number,height:number,
):{x:number;y:number} {
  const z=clampPhotoZoom(zoom);
  const limitX=Math.max(0,Number.isFinite(width)?width*(z-1)/2:0);
  const limitY=Math.max(0,Number.isFinite(height)?height*(z-1)/2:0);
  const clamp=(v:number,max:number)=>Math.max(-max,Math.min(max,Number.isFinite(v)?v:0));
  return {x:clamp(x,limitX),y:clamp(y,limitY)};
}
