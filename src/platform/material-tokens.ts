// Theme accent is decorative. Foreground always comes from the approved palette.
const channel=(hex:string,i:number)=>parseInt(hex.slice(i,i+2),16);
const valid=(x:string)=>/^#[0-9a-f]{6}$/i.test(x);
export function mixMaterial(base:string,accent:string,amount:number){
 if(!valid(base)||!valid(accent))return base;
 return '#'+[1,3,5].map(i=>Math.round(channel(base,i)*(1-amount)+channel(accent,i)*amount).toString(16).padStart(2,'0')).join('');
}
export function materialContrast(a:string,b:string){
 if(!valid(a)||!valid(b))return 0;
 const lum=(x:string)=>[1,3,5].map(i=>channel(x,i)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
 const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
export function materialTokens(surface:string,accent:string,ink:string){
 const hue=valid(accent)?accent:surface;
 const safeBase=materialContrast('#FFFFFF',ink)>=materialContrast('#000000',ink)?'#FFFFFF':'#000000';
 const tone=[...([.18,.12,.06,0].map(a=>mixMaterial(surface,hue,a))),...([.25,.5,.75,1].map(a=>mixMaterial(surface,safeBase,a)))].find(c=>materialContrast(c,ink)>=4.5)??surface;
 return {tone,glassTint:valid(hue)?hue+'24':undefined};
}
