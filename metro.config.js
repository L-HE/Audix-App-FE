// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// NativeWind 지원
config.resolver.sourceExts.push('css');

module.exports = config;