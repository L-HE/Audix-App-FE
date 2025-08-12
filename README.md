# Audix Mobile App - AI 기반 산업용 이상음 감지 모바일 앱

## 📱 앱 개요

Audix Mobile App은 자동차 공장의 기계 이상음을 실시간으로 모니터링하고 관리할 수 있는 React Native 기반 크로스플랫폼 모바일 애플리케이션입니다. 관리자가 언제 어디서나 공장 상태를 확인하고 즉시 대응할 수 있도록 설계되었습니다.

## 개발 실행

```bash
# Android 에뮬레이터에서 실행
npm run android
```

## ✨ 주요 기능

### 🔔 실시간 알림
- Push 알림을 통한 즉시 이상 징후 전달
- 알림 우선순위별 분류 (긴급, 주의, 정보)
- 알림 히스토리 및 읽음 상태 관리

### 📊 실시간 모니터링
- 공장별/기계별 실시간 상태 대시보드
- 음성 데이터 시각화 (파형, 주파수 분석)
- 이상 감지 현황 실시간 업데이트

### 🏭 다중 공장 관리
- 여러 공장 간 빠른 전환
- 공장별 기계 목록 및 상태
- 위치 기반 공장 정보

### 📈 간편 통계
- 일/주/월별 이상 감지 요약
- 기계별 성능 지표
- 트렌드 분석 차트

## 🛠️ 기술 스택

### Core
- **React Native** - 크로스플랫폼 모바일 개발
- **Expo** - 개발/빌드/배포 플랫폼
- **TypeScript** - 정적 타입 검사

### UI/UX
- **Expo Router** - 네비게이션
- **React Navigation** - 네비게이션

### 상태 관리
- **Zustand** - 경량 상태 관리

### 통신
- **Axios** - HTTP 클라이언트

### 데이터 시각화
- **React Native SVG** - SVG 렌더링

## 📁 프로젝트 구조

```
audix-app/
├── app/
│   ├── detail/
│   │   └── [id].tsx
│   ├── _layout.tsx
│   ├── index.tsx
│   └── notificationModal.tsx
├── assets/
│   ├── data/
│   │   ├── areaData.ts
│   │   ├── machineData.ts
│   │   └── modalData.ts
│   ├── fonts
│   └── images
├── components/                  # 재사용 가능한 컴포넌트
│   ├── common/                  # 공통 컴포넌트
│   │   ├── appBar.tsx
│   │   ├── bottomNav.tsx
│   │   └── header.tsx
│   └── screens/                 # 화면 컴포넌트
│       ├── areaCard.tsx
│       ├── machineCard.tsx
│       ├── searchInput.tsx
│       └── vDonutChart.tsx
├── shared/
│   ├── api/
│   │   └── modalContextApi.tsx
│   └── styles/
│       └── global.ts
├── app.json
├── babel.config.js
├── eslint.config.js
├── metro.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## 🚀 시작하기

### 사전 요구사항
- Node.js 18+
- npm 또는 yarn
- Expo CLI
- iOS Simulator (Mac) 또는 Android Emulator

### 설치

1. **의존성 설치**
```bash
npm install
```


### 개발 실행

```bash
# Expo 개발 서버 시작
npm start

# iOS 시뮬레이터에서 실행
npm run ios

# Android 에뮬레이터에서 실행
npm run android

# 웹에서 실행 (개발용)
npm run web
```


## 📱 주요 화면

### 1. 대시보드
- 전체 공장 상태 요약
- 실시간 알림 피드
- 빠른 액션 버튼

### 2. 모니터링
- 공장별/기계별 상세 모니터링
- 실시간 음성 데이터 시각화
- 이상 감지 알림 내역

### 3. 알림 센터
- 모든 알림 히스토리
- 중요도별 필터링
- 읽음/미읽음 상태 관리

### 4. 통계
- 일/주/월별 통계
- 기계별 성능 지표
- 트렌드 분석 차트

### 5. 설정
- 알림 설정
- 계정 관리
- 앱 환경설정

## 🔧 주요 컴포넌트

### `<RealtimeChart />`
실시간 음성 데이터를 시각화하는 차트 컴포넌트
```typescript
<RealtimeChart
  data={audioData}
  type="waveform"
  height={200}
  anomalyThreshold={0.8}
/>
```

### `<NotificationCard />`
알림을 표시하는 카드 컴포넌트
```typescript
<NotificationCard
  notification={notification}
  onPress={handleNotificationPress}
  onDismiss={handleDismiss}
/>
```

### `<StatusIndicator />`
기계 상태를 표시하는 인디케이터
```typescript
<StatusIndicator
  status="normal" | "warning" | "critical"
  size="small" | "medium" | "large"
/>
```

## 🔔 푸시 알림 설정

### 알림 권한 요청
```typescript
import { registerForPushNotificationsAsync } from './src/services/notifications';

// 앱 시작 시 권한 요청
await registerForPushNotificationsAsync();
```

### 백그라운드 알림 처리
```typescript
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

useEffect(() => {
  const subscription = Notifications.addNotificationReceivedListener(
    handleNotificationReceived
  );
  return () => subscription.remove();
}, []);
```

## 🔐 보안

### API 인증
- JWT 토큰 기반 인증
- 자동 토큰 갱신
- 안전한 토큰 저장 (Expo SecureStore)


### 코드 스타일
- ESLint + Prettier 사용
- TypeScript strict 모드
- Conventional Commits


**Audix Mobile App** - 언제 어디서나 안전한 공장 관리
