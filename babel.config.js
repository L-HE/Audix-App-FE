// babel.config.js
module.exports = function (api) {
  // Babel 캐시 활성화 (빌드 속도 향상)
  api.cache(true);

  return {
    // ===============================
    // Presets (변환 규칙 세트)
    // ===============================
    // ▸ 'babel-preset-expo': Expo + React Native 환경에 맞는 Babel 설정
    presets: ['babel-preset-expo'],

    // ===============================
    // Plugins (추가 변환/기능)
    // ===============================
    plugins: [
      // ▸ react-native-reanimated 전용 Babel 플러그인
      'react-native-reanimated/plugin',

      // ▸ 경로 별칭(alias) 설정 플러그인
      [
        'module-resolver',
        {
          // 모듈 해석의 기준 경로 (root)
          root: ['./'],

          // 확장자 목록 (자동으로 확장자 생략 가능)
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

          // 경로 별칭 설정
          alias: {
            '@': './',                        // 프로젝트 루트
            '@/common': './components/common', // 공용 컴포넌트
            '@/screens': './components/screens', // 화면 컴포넌트
            '@/assets': './assets',            // 전체 에셋
            '@/data': './assets/data',         // 데이터 파일
            '@/images': './assets/images',     // 이미지 리소스
            '@/app': './app',                  // 앱 진입점/라우트
            '@/api': './shared/api',           // API 관련 코드
            '@/store': './shared/store',       // Zustand 등 전역 상태
            '@/styles': './shared/styles',     // 스타일 관련 코드
          },
        },
      ],
    ],
  };
};
