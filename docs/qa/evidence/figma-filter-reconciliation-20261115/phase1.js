
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('398:2'));
const roots=figma.currentPage.children.filter(n=>/^(678:|682:|686:|690:|1040:)/.test(n.id)&&n.name.startsWith('Find ·')&&n.type==='FRAME'&&n.findOne(x=>x.name==='Search filters'));
if(roots.length!==26)throw Error('Expected 26 variants');
if(roots.some(f=>f.findOne(n=>n.name==='Location filter · reconciled')))throw Error('Already changed; inspect before retry');
const templates=await Promise.all(['1558:10','1558:15','1560:27','1560:97','1560:65','1560:135'].map(id=>figma.getNodeByIdAsync(id)));
const fonts=new Map();for(const f of [...roots,...templates.filter(Boolean)])for(const t of f.findAllWithCriteria({types:['TEXT']}))for(const s of t.getStyledTextSegments(['fontName']))fonts.set(JSON.stringify(s.fontName),s.fontName);
await Promise.all([...fonts.values()].map(f=>figma.loadFontAsync(f)));
let px=Math.max(...figma.currentPage.children.map(n=>n.x+n.width))+200, slot=0;
const place=n=>{figma.currentPage.appendChild(n);n.x=px+(slot%8)*440;n.y=Math.floor(slot/8)*1000;slot++;};
const newRoots=[],mutated=new Set(),components={};
for(const [theme,id] of [['Light','1558:10'],['Dark','1558:15']]){
 const template=await figma.getNodeByIdAsync(id);const c=template.clone();place(c);const main=figma.createComponentFromNode(c);main.name='Find / Location filter / '+theme;await main.setReactionsAsync([]);main.description='Approved CasitaDex Location filter. Reused in combined-filter states; 48-point control.';
 components[theme]=main;newRoots.push(main);
}
const action=(id,nav='NAVIGATE')=>({type:'NODE',destinationId:id,navigation:nav,transition:null,resetScrollPosition:false});
const click=async(n,actions)=>{await n.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions}]);mutated.add(n.id);};
function instance(theme,label,width=112){const n=components[theme].createInstance();n.name='Location filter · reconciled';n.resize(width,48);const t=n.findOne(x=>x.type==='TEXT');t.characters=label;return n;}
const pairs=[];
for(const f of roots){
 const theme=f.name.includes('Dark')?'Dark':'Light',row=f.findOne(n=>n.name==='Search filters');
 const loc=instance(theme,'Location  ▾');row.insertChild(2,loc);
 row.layoutWrap='WRAP';row.itemSpacing=8;row.counterAxisSpacing=8;row.counterAxisSizingMode='AUTO';
 for(const c of row.children){c.resize(Math.max(c.width,48),48);c.layoutSizingVertical='FIXED';mutated.add(c.id);}
 mutated.add(row.id);mutated.add(f.id);
 let selected=null;
 if(!f.name.includes('Garage')){
   selected=f.clone();place(selected);selected.name=f.name+' · Location selected';
   const l=selected.findOne(n=>n.name==='Location filter · reconciled');l.resize(300,48);
   l.findOne(n=>n.type==='TEXT').characters='Return grille · Hallway  ▾';
   const ref=await figma.getNodeByIdAsync(theme==='Dark'?'1560:97':'1560:27');
   if(ref&&'fills'in ref){l.fills=ref.fills;l.strokes=ref.strokes;}
   newRoots.push(selected);
   const result=selected.findOne(n=>n.name==='Open Hallway air filter');
   if(result){const rs=JSON.parse(JSON.stringify(result.reactions));for(const r of rs)for(const a of (r.actions??[r.action]))if(a.type==='SET_VARIABLE'&&a.variableValue?.value===f.id)a.variableValue.value=selected.id;await result.setReactionsAsync(rs);}
 }
 const modal=(await figma.getNodeByIdAsync(theme==='Dark'?'1560:135':'1560:65')).clone();place(modal);modal.name='Location · '+f.name+' · Preserve filters';
 const all=modal.children.find(n=>n.type==='TEXT'&&n.characters==='All locations');
 const choice=modal.children.find(n=>n.type==='TEXT'&&n.characters==='Return grille · Hallway');
 const allIndex=modal.children.indexOf(all), allButton=instance(theme,'All',298);allButton.name='All locations';modal.insertChild(allIndex,allButton);all.remove();await click(allButton,[action(f.id)]);
 if(selected){const idx=modal.children.indexOf(choice),choose=instance(theme,'Return grille · Hallway',298);choose.name='Select Return grille · Hallway';modal.insertChild(idx,choose);choice.remove();await click(choose,[action(selected.id)]);}
 else{choice.characters='No saved Locations in Garage';await choice.setReactionsAsync([]);}
 const close=modal.children.find(n=>n.name==='Close preview');close.resize(close.width,48);await click(close,[{type:'CLOSE'}]);
 newRoots.push(modal);await click(loc,[action(modal.id,'OVERLAY')]);
 if(selected)await click(selected.findOne(n=>n.name==='Location filter · reconciled'),[action(modal.id,'OVERLAY')]);
 pairs.push({base:f.id,selected:selected?.id??null,modal:modal.id,theme,name:f.name});
}
const createdNodeIds=[...new Set(newRoots.flatMap(n=>[n.id,...n.findAll(()=>true).map(c=>c.id)]))];
return {pairs,components:Object.fromEntries(Object.entries(components).map(([k,n])=>[k,n.id])),createdNodeIds,mutatedNodeIds:[...mutated],counts:{variants:roots.length,selected:pairs.filter(p=>p.selected).length,modals:pairs.length}};
