export const photoZoomScale=(scale:number)=>Math.max(1,Math.min(4,Number.isFinite(scale)?scale:1));
export function touchDistance(touches:readonly {pageX:number;pageY:number}[]){return touches.length<2?0:Math.hypot(touches[0].pageX-touches[1].pageX,touches[0].pageY-touches[1].pageY);}
