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
- 모달 알림을 통한 즉시 이상 징후 전달
- 알림 우선순위별 분류 (긴급, 주의, 정보)
- 알림 히스토리 및 장비 점검 여부 상태 관리

### 📊 실시간 모니터링
- 공장별/기계별 실시간 상태 대시보드
- 음성 데이터의 정상도 표현
- 이상 감지 현황 실시간 업데이트

### 🏭 다중 공장 관리
- 여러 공장 간 빠른 전환
- 공장별 기계 목록 및 상태

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

### 데이터 시각화
- **React Native SVG** - SVG 렌더링

## 📁 프로젝트 구조

```
audix-app/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   ├── (tabs)/
│   │   ├── alarms/
│   │   │   └── index.tsx
│   │   ├── detail/
│   │   │   └── [id].tsx
│   │   ├── menu/
│   │   │   └── index.tsx
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── notificationModal.tsx
│   └── _layout.tsx
├── assets/
│   ├── data
│   ├── fonts/
│   │   └── SpaceMono-Regular.ttf
│   └── images/
│       ├── icons/
│       │   └── AudixLogoNavySimple.png
│       ├── logos/
│       │   ├── AudixLogoNavy.png
│       │   └── AudixLogoNavySimpleTransparent.png
│       └── pictures
├── components/
│   ├── common/
│   │   ├── appBar.tsx
│   │   ├── bottomNav.tsx
│   │   ├── header.tsx
│   │   ├── loadingScreen.tsx
│   │   ├── skeletonLoader.tsx
│   │   └── splashScreen.tsx
│   └── screens/
│       ├── alarmCard.tsx
│       ├── areaCard.tsx
│       ├── logoutModal.tsx
│       ├── machineCard.tsx
│       ├── nativeDonutChart.tsx
│       └── searchInput.tsx
├── shared/
│   ├── api/
│   │   ├── area.tsx
│   │   ├── config.ts
│   │   ├── device.tsx
│   │   └── modalContextApi.tsx
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── loadingStore.ts
│   │   ├── refreshStore.ts
│   │   └── timeStore.ts
│   ├── styles/
│   │   ├── colors.ts
│   │   ├── components.ts
│   │   └── screens.ts
│   └── websocket/
│       └── client.ts
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

# Android 에뮬레이터에서 실행
npx expo run:android

# 웹에서 실행 (개발용)
npm run web
```


## 📱 주요 화면

### 1. 구역 스크린
- 전체 공장 상태 요약
- 실시간 알림 피드

### 2. 장비 모니터링
- 공장별/기계별 상세 모니터링
- 실시간 음성 데이터에 대한 정상도 시각화
- 이상 감지 알림

### 3. 알림 스크린
- 모든 알림 히스토리
- 중요도별 필터링

### 4. 설정
- 내 정보
- 비밀번호 변경
- 문의하기
- 로그아웃

## 🔧 주요 컴포넌트

### `<NativeDonutChart />`
실시간 음성 데이터에 대한 정상도 차트 컴포넌트
```typescript
<NativeDonutChart
  deviceId={String(deviceId)}
  normalScore={normalScore}
  status={status}
  name={name}
  initialAnimate={!!animateOnFirstMount}
/>
```

### `<AreaCard />`
실시간 구역 상태를 나타내는 카트 컴포넌트
```typescript
<FlashList
  data={sortedCards}
  renderItem={renderAreaCard}
  keyExtractor={keyExtractor}
  estimatedItemSize={120}
  showsVerticalScrollIndicator={false}
  removeClippedSubviews={true}
  contentContainerStyle={contentContainerStyle}
  drawDistance={200}
  disableAutoLayout={true}
  scrollEventThrottle={16}
  decelerationRate="fast"
  overrideItemLayout={overrideItemLayout}
  getItemType={getItemType}
/>
```

### `<MachineCard />`
실시간 장비 상태를 나타내는 카트 컴포넌트
```typescript
<FlashList
  data={sortedMachines}
  renderItem={renderMachine}
  keyExtractor={keyExtractor}
  getItemType={getItemType}
  estimatedItemSize={270}
  drawDistance={200}
  onEndReached={handleEndReached}
  onEndReachedThreshold={0.5}
  onScroll={handleScroll}
  scrollEventThrottle={16}
  onContentSizeChange={handleContentSizeChange}
  onLayout={onLayoutRoot}
  removeClippedSubviews={true}
  extraData={isLoadingMore}
  disableAutoLayout={true}
/>
```

### `<AlarmCard />`
알림을 표시하는 카드 컴포넌트
```typescript
<FlashList<AlarmData>
  data={paginatedData}
  renderItem={renderAlarmCard}
  keyExtractor={keyExtractor}
  getItemType={getItemType}
  estimatedItemSize={120}
  onEndReached={onEndReached}
  onEndReachedThreshold={0.5}
  viewabilityConfig={viewabilityConfig}
  showsVerticalScrollIndicator={false}
  removeClippedSubviews={true}
  drawDistance={300}
  contentContainerStyle={style.contentContainer}
  ListFooterComponent={footerComponent}
/>
```

### `<NotificationModal />`

## 🔐 보안

### 코드 스타일
- ESLint 사용
- TypeScript strict 모드
- Conventional Commits


**Audix Mobile App** - 언제 어디서나 안전한 공장 관리
