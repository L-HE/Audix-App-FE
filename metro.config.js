const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// NativeWind 사용 시
config.resolver.sourceExts.push('css');

module.exports = config;