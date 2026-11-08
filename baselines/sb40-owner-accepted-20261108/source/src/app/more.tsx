import React from 'react';
import {ScrollView} from 'react-native';
import {router} from 'expo-router';
import {FigmaSettings} from '../figma-first/FigmaSettings';
function NativeSettings(){return <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:'transparent'}}><FigmaSettings onOpen={action=>router.push({pathname:'/settings-manage',params:{action}})}/></ScrollView>}
export default function Settings(){return <NativeSettings/>;}