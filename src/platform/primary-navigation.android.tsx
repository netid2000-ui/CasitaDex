import React from 'react';
import { View } from 'react-native';
import { Host, NavigationBar, NavigationBarItem, RNHostView, Text } from '@expo/ui/jetpack-compose';
import type { PlatformNavigationProps } from './primary-navigation.types';

// Material 3's actual Compose navigation component provides selection, indicator and ripple semantics.
export function PlatformPrimaryNavigation({items,dark,surface,selected,ink,muted}:PlatformNavigationProps) {
  return <View testID="native-material3-navigation" style={{backgroundColor:surface}}>
    <Host matchContents={{vertical:true}} colorScheme={dark?'dark':'light'} style={{width:'100%'}}>
      <NavigationBar containerColor={surface} contentColor={ink} tonalElevation={0}>
        {items.map(item=><NavigationBarItem key={item.label} selected={item.selected} onClick={item.onPress} alwaysShowLabel
          colors={{selectedIconColor:ink,selectedTextColor:ink,selectedIndicatorColor:selected,unselectedIconColor:muted,unselectedTextColor:muted}}>
          <NavigationBarItem.Icon><RNHostView matchContents><View accessible={false} style={{width:24,height:24,alignItems:'center',justifyContent:'center'}}>{item.icon}</View></RNHostView></NavigationBarItem.Icon>
          <NavigationBarItem.Label><Text style={{fontSize:12,fontWeight:item.selected?'600':'400'}}>{item.label}</Text></NavigationBarItem.Label>
        </NavigationBarItem>)}
      </NavigationBar>
    </Host>
  </View>;
}
