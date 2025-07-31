// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
        'react-native-reanimated/plugin',
        [
          'module-resolver',
          {
            root: ['./'],
            extensions: [
              '.ios.ts',
              '.android.ts',
              '.native.ts',
              '.ts',
              '.ios.tsx',
              '.android.tsx',
              '.native.tsx',
              '.tsx',
              '.jsx',
              '.js',
              '.json',
            ],
            alias: {
              // 루트 경로
              '@': './',

              // 컴포넌트 관련
              '@/common': './components/common',
              '@/screens': './components/screens',

              // 자산 관련
              '@/assets': './assets',
              '@/images': './assets/images',

              // 앱 관련
              '@/app': './app',

              // 비즈니스 로직 및 스타일 관련
              '@/api': './shared/api',
              '@/store': './shared/store',
              '@/styles': './shared/styles',
            },
          },
        ],
      ]
  };
};