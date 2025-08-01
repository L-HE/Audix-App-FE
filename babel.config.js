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
              '@': './',
              '@/common': './components/common',
              '@/screens': './components/screens',
              '@/assets': './assets',
              '@/data': './assets/data',
              '@/images': './assets/images',
              '@/app': './app',
              '@/api': './shared/api',
              '@/store': './shared/store',
              '@/styles': './shared/styles',
            },
          },
        ],
      ]
  };
};