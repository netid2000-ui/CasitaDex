import {setup,hash} from './eng-fixture.mjs';
import {legacyEngSnapshot,newEngDraft} from '../src/eng-store.ts';
import {empty} from '../src/model.ts';
// Deliberately synthetic household data. Never credentials, access codes or personal information.
export const cases=[
 ['HVAC filter','20 × 25 × 1','Hall closet ceiling','Maintenance'],
 ['Refrigerator water filter','EDR4RXD1','Kitchen refrigerator','Appliances'],
 ['Water shutoff','Blue lever beside the utility sink','Garage left wall','Maintenance'],
 ['Living room paint','Sage neutral · sample SW-6178','Workshop shelf B','Home'],
 ['Smoke alarm battery','AA lithium · check label before purchase','Upstairs landing','Maintenance'],
 ['Vacuum replacement bag','Type GN','Laundry cupboard','Appliances'],
 ['Dishwasher model','TEST-DW-2400','Kitchen cabinet pocket','Appliances'],
 ['Lawn mower blade','TEST-LM-21','Garden shed','Equipment'],
 ['Bicycle tire','700 × 32C','Garage rack','Equipment'],
 ['Guest bedding','Queen · linen cotton blend','Linen cupboard top shelf','Home'],
 ['Seasonal decorations','Blue storage tote','Garage shelf C','Home'],
 ['Filtro de agua','Modelo TEST-AGUA-12','Cocina · cajón inferior','Appliances'],
 ['工具の保管場所','青い箱 · 棚の上','Workshop','Equipment'],
 ['Rental HVAC filter','16 × 20 × 1','Rental utility closet','Maintenance'],
 ['Old vacuum bag','Type FJM','Archive example','Appliances'],
 ['Retired desk lamp','E26 · 9 W LED','Recently Deleted example','Home'],
 ['Long care instructions','Hand wash with mild soap; air dry fully before storage. '.repeat(12),'Laundry cupboard','Home'],
 ['Unsorted household detail','Spare felt pads are in the stationery tray','',''],
];
export async function household(png){
 const initial=legacyEngSnapshot(JSON.stringify(empty()));
 initial.data.spaces.push({id:'rental',name:'Rental'});
 initial.data.categories=['Maintenance','Appliances','Home','Equipment'].map((name,i)=>({id:'cat_'+i,name}));
 initial.data.memories=cases.map(([title,answer,location,cat],i)=>({id:'scenario_'+i,title,answer,spaceId:i===13?'rental':i===17?null:'home',categoryIds:cat?['cat_'+['Maintenance','Appliances','Home','Equipment'].indexOf(cat)]:[],legacyContext:null,location,notes:'SYNTHETIC QA · not a real household record.',confidence:i%3===0?'Verified':i%3===1?'Needs checking':'Unknown',source:i%3===0?'Synthetic equipment label':'',...(i%3===0?{verifiedAt:'2026-10-19'}:{}),...(i<3?{due:['2026-10-18','2026-10-19','2026-11-19'][i]}:{}),history:[],lifecycle:i===14?'archived':i===15?'recently_deleted':'active',...(i===15?{deletedAt:'2026-10-19'}:{}),mediaIds:[],createdAt:`2026-10-${String(i+1).padStart(2,'0')}T12:00:00.000Z`}));
 const f=setup(initial);
 const photo={...newEngDraft(),checkpoint:1,title:'Photo-only equipment label',notes:'Synthetic label image',spaceId:'home',categoryIds:['cat_3']};
 await f.store.checkpoint(photo);await f.store.addPhoto(photo.id,png);await f.store.saveDraft(photo.attempt,photo.memoryId);
 const draft={...newEngDraft(),checkpoint:1,title:'Unfinished garden project',answer:'TEST-MULCH-40',notes:'Retain partially completed details',source:'Synthetic garden label',due:'2026-11-',spaceId:'rental',categoryIds:['cat_3']};
 await f.store.checkpoint(draft);await f.store.addPhoto(draft.id,png);
 return {...f,hash,snapshot:await f.store.load()};
}
