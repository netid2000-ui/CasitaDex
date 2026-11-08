import React from 'react';
import {router,useLocalSearchParams} from 'expo-router';
import {PhotoMemoryViewer} from '../photo-memory-viewer';
export default function FullScreenPhoto(){
 const {path,label,memoryId,photoId,draftId}=useLocalSearchParams<{path:string;label?:string;memoryId?:string;photoId?:string;draftId?:string}>();
 return <PhotoMemoryViewer key={[memoryId,draftId,photoId,path].join(':')} memoryId={memoryId} draftId={draftId} initialPhotoId={photoId} path={path} label={label} onClose={()=>router.back()} onViewMemory={memoryId?()=>router.replace({pathname:'/card',params:{id:memoryId}}):draftId?()=>router.back():undefined}/>;
}
