import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"../src/figma-first");
const files=readdirSync(root).filter(f=>/\.(tsx?|jsx?)$/.test(f));
test("new native foundation does not import legacy presentation",()=>{
 assert.ok(files.includes("PrimaryCta.tsx")&&files.includes("tokens.ts"));
 for(const name of files){const text=readFileSync(resolve(root,name),"utf8");
  assert.doesNotMatch(text,/from\s*["\x27][^"\x27]*(?:eng-screens|screens|\/ui|\/theme|home-action|accepted-navigation-icon)["\x27]/);
  assert.doesNotMatch(text,/LOGO PLACEHOLDER|className=|tailwind/);
 }
});
test("primary CTA encodes Figma platform, theme and state variations",()=>{
 const text=readFileSync(resolve(root,"tokens.ts"),"utf8");
 for(const value of ["#F7F2E8","#E8DECB","#1E4635","#477E65","#173D2E","#C5DFC7","#F2A640"]){assert.ok(text.includes(value),value)}
 assert.match(text,/platform === "ios" \? 11 : 24/);
 assert.match(text,/state === "disabled"/);
});
test("new CTA has native and accessible press behavior",()=>{
 const text=readFileSync(resolve(root,"PrimaryCta.tsx"),"utf8");
 for(const value of ["Pressable","accessibilityRole","accessibilityLabel","accessibilityState","disabled={disabled}","allowFontScaling"]){assert.ok(text.includes(value),value)}
});
test("Figma Home cards preserve accessible primary/secondary actions in both themes",()=>{
 const text=readFileSync(resolve(root,"HomeActionCard.tsx"),"utf8");
 for(const label of ["Add Memory","Add Photo Memory","Add Reminder","Capture a useful detail","Start with an image","Remember the next step"]){assert.ok(text.includes(label),label)}
 for(const prop of ["fg.actionSurface","fg.actionIconSurface","fg.brandSurface","accessibilityRole","accessibilityState","disabled={disabled}"]){assert.ok(text.includes(prop),prop)}
 assert.doesNotMatch(text,/from\s*["\x27][^"\x27]*(?:\/ui|\/theme|home-action|eng-screens|screens)["\x27]/);
});

test("CTA pressed feedback uses semantic colors and text can grow",()=>{
 const c=readFileSync(resolve(root,"PrimaryCta.tsx"),"utf8");
 const t=readFileSync(resolve(root,"tokens.ts"),"utf8");
 assert.match(c,/visual\.pressedBackgroundColor/);
 assert.match(c,/allowFontScaling/);
 assert.doesNotMatch(c,/numberOfLines=\{2\}/);
 assert.match(t,/#AED1B1/); assert.match(t,/#103C30/);
});

test("focused CTA renders inner stroke and independent outer halo",()=>{
 const c=readFileSync(resolve(root,"PrimaryCta.tsx"),"utf8");
 const t=readFileSync(resolve(root,"tokens.ts"),"utf8");
 assert.match(c,/borderColor:showFocus\?visual\.focusHaloColor:"transparent"/);
 assert.match(c,/borderColor:showFocus\?visual\.focusColor:"transparent"/);
 assert.match(c,/const showFocus = !disabled && \(focused \|\| nativeFocused\)/);
 assert.match(t,/focusHaloColor/);
});
