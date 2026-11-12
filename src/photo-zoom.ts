export const photoZoomScale=(scale:number)=>Math.max(1,Math.min(4,Number.isFinite(scale)?scale:1));
export function touchDistance(touches:readonly {pageX:number;pageY:number}[]){return touches.length<2?0:Math.hypot(touches[0].pageX-touches[1].pageX,touches[0].pageY-touches[1].pageY);}


/** Keep enlarged image centered within its actual visible viewport. */
export function boundedPhotoPan(x:number,y:number,scale:number,width:number,height:number){
 const z=photoZoomScale(scale);
 const limitX=Math.max(0,Number.isFinite(width)?width*(z-1)/2:0);
 const limitY=Math.max(0,Number.isFinite(height)?height*(z-1)/2:0);
 const clamp=(n:number,limit:number)=>limit===0?0:Math.max(-limit,Math.min(limit,Number.isFinite(n)?n:0));
 return {x:clamp(x,limitX),y:clamp(y,limitY)};
}

/** At base zoom, deliberate horizontal swipes navigate; zoomed gestures pan instead. */
export function photoSwipeDirection(dx:number,dy:number,scale:number){
 if(photoZoomScale(scale)!==1||!Number.isFinite(dx)||!Number.isFinite(dy)
   ||Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy)*1.5)return 0;
 return dx<0?1:-1;
}
