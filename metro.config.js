// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// NativeWind 지원
config.resolver.sourceExts.push('css');

// tslib 해결을 위한 resolver 설정 추가
config.resolver.alias = {
  ...config.resolver.alias,
  'tslib': require.resolve('tslib'),
};

// Flipper 지원 추가
if (__DEV__) {
  config.transformer.minifierConfig = {
    keep_fnames: true, // 함수 이름 유지
    mangle: {
      keep_fnames: true,
    },
  };
}

module.exports = config;