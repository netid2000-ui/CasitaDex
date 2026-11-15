// Copied into isolated native staging only; never a production route.
import React,{useEffect,useState} from 'react';
import {AccessibilityInfo,Text,View} from 'react-native';
import {useStatusAnnouncement} from '../use-status-announcement';
export default function AnnouncementProbe(){
 const [message,setMessage]=useState(''),[events,setEvents]=useState<string[]>([]);
 useStatusAnnouncement(message);
 useEffect(()=>{
  const sub=AccessibilityInfo.addEventListener('announcementFinished',event=>setEvents(old=>[...old,event.announcement+':'+event.success]));
  const timers=[setTimeout(()=>setMessage('Saved on this device.'),2000),setTimeout(()=>setMessage(''),6000),setTimeout(()=>setMessage('Saved on this device.'),7000),setTimeout(()=>setMessage('Could not save. Your saved memory is unchanged.'),12000)];
  return()=>{sub.remove();timers.forEach(clearTimeout);};
 },[]);
 return <View style={{padding:30}}><Text>Announcement test</Text><Text accessibilityLiveRegion="polite">{message}</Text><Text testID="announcement-results">{events.join('|')}</Text></View>;
}
