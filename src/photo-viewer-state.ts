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
