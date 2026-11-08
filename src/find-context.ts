import type {MemoryV2} from './sb20-contract';
type Lifecycle=MemoryV2['lifecycle'];
export type FindContext={query:string;page:number;pageSize:number;y:number;photosOnly:boolean};
const blank=():FindContext=>({query:'',page:0,pageSize:10,y:0,photosOnly:false});
const contexts:Record<Lifecycle,FindContext>={active:blank(),archived:blank(),recently_deleted:blank()};
export function readFindContext(lifecycle:Lifecycle):FindContext{return {...contexts[lifecycle]};}
export function saveFindContext(lifecycle:Lifecycle,patch:Partial<FindContext>):void{contexts[lifecycle]={...contexts[lifecycle],...patch};}
