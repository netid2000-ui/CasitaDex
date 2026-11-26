import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEFAULT_MATERIAL_APPEARANCE,parseMaterialAppearance,type MaterialAppearance} from './material-tokens';
const KEY='@designs-by-fa/material-appearance-v1';
const Context=createContext<{appearance:MaterialAppearance;setAppearance:(mode:MaterialAppearance)=>void;ready:boolean;error:string}>({appearance:DEFAULT_MATERIAL_APPEARANCE,setAppearance:()=>{},ready:true,error:''});
export function MaterialAppearanceProvider({children}:{children:React.ReactNode}){
 const [appearance,setMode]=useState<MaterialAppearance>(DEFAULT_MATERIAL_APPEARANCE),[ready,setReady]=useState(false),[error,setError]=useState('');
 const queue=useRef(Promise.resolve());
 useEffect(()=>{let active=true;AsyncStorage.getItem(KEY).then(v=>{if(active)setMode(parseMaterialAppearance(v));}).catch(()=>{if(active)setError('Could not load material preference. Enhanced is active.');}).finally(()=>{if(active)setReady(true);});return()=>{active=false;};},[]);
 function setAppearance(mode:MaterialAppearance){if(!ready)return;setMode(mode);setError('');queue.current=queue.current.then(()=>AsyncStorage.setItem(KEY,mode)).catch(()=>setError('Could not save material preference. Applies for this session.'));}
 return <Context.Provider value={{appearance,setAppearance,ready,error}}>{children}</Context.Provider>;
}
export function useMaterialAppearance(){return useContext(Context);}
