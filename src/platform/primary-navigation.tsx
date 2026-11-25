import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, Pressable, Text, View, StyleSheet } from 'react-native';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import type { PlatformNavigationProps } from './primary-navigation.types';

// The content remains in normal layout; the native material only affects the navigation surface.
export function PlatformPrimaryNavigation({items, dark, surface, selected, ink, muted}: PlatformNavigationProps) {
  // An opaque surface is the safe default until the accessibility preference is known.
  const [reduceTransparency, setReduceTransparency] = useState(true);
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    let mounted = true;
    let changed = false;
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', value => {
      changed = true;
      if (mounted) setReduceTransparency(value);
    });
    AccessibilityInfo.isReduceTransparencyEnabled().then(value => {
      if (mounted && !changed) setReduceTransparency(value);
    }).catch(() => undefined);
    return () => { mounted = false; sub.remove(); };
  }, []);
  const glass = Platform.OS === 'ios' && !reduceTransparency && isGlassEffectAPIAvailable() && isLiquidGlassAvailable();
  const content = items.map(item => (
    <Pressable key={item.label} accessibilityRole="tab" accessibilityLabel={item.label}
      accessibilityState={{selected:item.selected}} onPress={item.onPress}
      style={({pressed}) => [styles.tab,item.selected && {backgroundColor:selected},pressed && {opacity:0.75}]}>
      <View accessible={false} style={styles.icon}>{item.icon}</View>
      <Text style={[styles.label,{color:item.selected?ink:muted,fontWeight:item.selected?'600':'400'}]}>{item.label}</Text>
    </Pressable>
  ));
  return <View style={styles.outer} testID="platform-primary-navigation">
    {glass ? <GlassView testID="native-liquid-glass-navigation" glassEffectStyle="regular" colorScheme={dark?'dark':'light'}
      style={styles.bar}>{content}</GlassView> :
      <View testID="opaque-navigation-fallback" style={[styles.bar,{backgroundColor:surface}]}>{content}</View>}
  </View>;
}
const styles=StyleSheet.create({
  outer:{paddingHorizontal:12,paddingTop:5,paddingBottom:4},
  bar:{minHeight:64,borderRadius:32,padding:4,flexDirection:'row',alignItems:'stretch',gap:3,overflow:'hidden'},
  tab:{flex:1,minHeight:56,borderRadius:28,alignItems:'center',justifyContent:'center',gap:2,paddingVertical:4},
  icon:{width:24,height:24,alignItems:'center',justifyContent:'center'},
  label:{fontSize:12,textAlign:'center'},
});
