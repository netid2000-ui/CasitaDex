import React from 'react';
import {useLocalSearchParams} from 'expo-router';
import {EngMore} from '../eng-screens';
export default function SettingsManage(){const {action}=useLocalSearchParams<{action?:string}>();return <EngMore key={action??"menu"} initialAction={action}/>;}
