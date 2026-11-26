import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8');
test('iOS native material respects accessibility and unsupported OS fallback',()=>{
 const s=read('src/platform/primary-navigation.tsx');
 for(const contract of ['isReduceTransparencyEnabled','reduceTransparencyChanged','isGlassEffectAPIAvailable()','isLiquidGlassAvailable()','native-liquid-glass-navigation','opaque-navigation-fallback','accessibilityState={{selected:item.selected}}'])assert.ok(s.includes(contract),contract);
});
test('Android native Material navigation uses controlled state and guarded callbacks',()=>{
 const s=read('src/platform/primary-navigation.android.tsx');
 for(const contract of ['@expo/ui/jetpack-compose','<NavigationBar ','<NavigationBarItem ','selected={item.selected}','onClick={item.onPress}','selectedIndicatorColor:tone','alwaysShowLabel'])assert.ok(s.includes(contract),contract);
});
