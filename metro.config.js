// Keep Expo defaults; reject missing or drifted runtime bridge before any bundling.
require('./scripts/decoder-interop.cjs')();
const { getDefaultConfig } = require('expo/metro-config');
module.exports = getDefaultConfig(__dirname);
