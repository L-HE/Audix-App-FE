// https://docs.expo.dev/guides/using-eslint/

// defineConfig: ESLint 설정을 타입 안전하게 정의할 수 있는 함수
const { defineConfig } = require('eslint/config');

// expoConfig: Expo 환경에 맞춘 ESLint 기본 규칙 세트(Flat Config 방식)
const expoConfig = require('eslint-config-expo/flat');

// ESLint 설정 내보내기
module.exports = defineConfig([
  // 1) Expo 권장 ESLint 설정 적용
  expoConfig,

  // 2) 프로젝트별 추가 설정
  {
    // ESLint 검사에서 제외할 경로
    ignores: ['dist/*'], // dist 폴더(빌드 산출물)는 린트 제외
  },
]);
