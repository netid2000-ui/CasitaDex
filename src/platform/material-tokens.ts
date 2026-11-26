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
export const MATERIAL_APPEARANCES=['subtle','enhanced','expressive'] as const;
export type MaterialAppearance=typeof MATERIAL_APPEARANCES[number];
export const DEFAULT_MATERIAL_APPEARANCE:MaterialAppearance='enhanced';
export function parseMaterialAppearance(raw:unknown):MaterialAppearance {
 return MATERIAL_APPEARANCES.includes(raw as MaterialAppearance)?raw as MaterialAppearance:DEFAULT_MATERIAL_APPEARANCE;
}
export function materialTokens(surface:string,accent:string,ink:string,appearance:MaterialAppearance='subtle'){
 const hue=valid(accent)?accent:surface;
 const safeBase=materialContrast('#FFFFFF',ink)>=materialContrast('#000000',ink)?'#FFFFFF':'#000000';
 const amount={subtle:.18,enhanced:.30,expressive:.44}[appearance];
 const tone=[...([amount,amount*.66,amount*.33,0].map(a=>mixMaterial(surface,hue,a))),...([.25,.5,.75,1].map(a=>mixMaterial(surface,safeBase,a)))].find(c=>materialContrast(c,ink)>=4.5)??surface;
 // Native tint over a photograph can be considerably brighter than the opaque tone.
 const glassHue=appearance==='subtle'?hue:[0,.12,.24,.36,.48,.60,.72,.84,1].map(a=>mixMaterial(hue,safeBase,a)).find(c=>materialContrast(c,ink)>=5.5)??safeBase;
 return {tone,glassTint:valid(glassHue)?glassHue+({subtle:'24',enhanced:'59',expressive:'8C'}[appearance]):undefined,edge:valid(hue)?hue+({subtle:'36',enhanced:'80',expressive:'C0'}[appearance]):undefined};
}
