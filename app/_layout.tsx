// app/_layout.tsx
import { Slot } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Host } from 'react-native-portalize';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from '../components/common/splashScreen';
import { ModalProvider, useModal } from '../shared/api/modalContextApi';
import { useTimeStore } from '../shared/store/timeStore';
import { webSocketClient } from '../shared/websocket/client';
import { preloadLoginAssets } from './(auth)/login';

export const headerShown = false;

/* =============================================================================
   타입 & 유틸
   ============================================================================= */

// ▸ 백그라운드 작업 구조
interface BackgroundTask {
  name: string;
  task: () => Promise<void>;
  priority: 'high' | 'medium' | 'low';
  required: boolean;
}

/* =============================================================================
   RootLayoutContent
   - 앱 초기화, 스플래시 → 본 UI 전환, 백그라운드 태스크 실행, 타이머/웹소켓 관리
   ============================================================================= */

function RootLayoutContent() {
  // ----- 전역 UI 스테이트 -----
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ----- 모달 제어 -----
  const { setModalVisible } = useModal();

  // ----- 재실행/중복 방지용 ref -----
  const initializationStartedRef = useRef(false);
  const backgroundTasksRef = useRef<BackgroundTask[]>([]);

  // ----- 타임스토어(상대시간 UI 갱신) -----
  const startTimer = useTimeStore((s) => s.startTimer);
  const stopTimer = useTimeStore((s) => s.stopTimer);

  // ---------------------------------------------------------------------------
  // 백그라운드 작업 정의 (UI 표시 후 실행)
  // ---------------------------------------------------------------------------
  const defineBackgroundTasks = (): BackgroundTask[] => [
    { name: 'DatabaseInit',      task: async () => { await wait(500); }, priority: 'high',   required: false },
    { name: 'AnalyticsSetup',    task: async () => { await wait(300); }, priority: 'medium', required: false },
    { name: 'CachePreload',      task: async () => { await wait(800); }, priority: 'low',    required: false },
    { name: 'RemoteConfigFetch', task: async () => { await wait(400); }, priority: 'medium', required: false },
  ];

  // ---------------------------------------------------------------------------
  // 백그라운드 작업 실행기
  // - 우선순위 배치별로 비동기 실행
  // - 성능 계측/로그 제거(요청사항)
  // ---------------------------------------------------------------------------
  const executeBackgroundTasks = useCallback(() => {
    // 이미 실행 중이면 재시작 방지
    if (backgroundTasksRef.current.length > 0) return;

    const tasks = defineBackgroundTasks();
    backgroundTasksRef.current = tasks;

    const high = tasks.filter((t) => t.priority === 'high');
    const med  = tasks.filter((t) => t.priority === 'medium');
    const low  = tasks.filter((t) => t.priority === 'low');

    const runBatch = async (batch: BackgroundTask[]) => {
      await Promise.all(batch.map(async (bg) => {
        try { await bg.task(); } catch { /* 실패해도 앱 흐름은 유지 */ }
      }));
    };

    // 즉시/지연 실행으로 배치 순차 시작
    runBatch(high);
    setTimeout(() => { runBatch(med); }, 50);
    setTimeout(() => { runBatch(low); }, 200);
  }, []);

  // ---------------------------------------------------------------------------
  // 스플래시 완료 콜백
  // - 필요 시 로그인 화면 진입 등 추가 처리 가능
  // ---------------------------------------------------------------------------
  const handleSplashComplete = useCallback(() => {
    // 추가 액션이 필요하면 여기에 작성
  }, []);

  // ---------------------------------------------------------------------------
  // 초기화 로직
  // - 1회만 실행(가드)
  // - 에셋 프리로드, 토큰 확인, 웹소켓 연결, 타이머 시작
  // - UI 표시 이후 백그라운드 태스크 실행
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (initializationStartedRef.current) return;
    initializationStartedRef.current = true;

    const initializeApp = async () => {
      try {
        // 1) 로그인 화면(아이콘/폰트 등) 에셋 조기 프리로드
        preloadLoginAssets();

        // 2) 인증 토큰 확인 (샘플: 존재 여부만 판단)
        const token = await checkAuthToken();
        setIsAuthenticated(!!token);

        // 3) WebSocket 연결 및 알림 핸들러
        try {
          webSocketClient.connect();
          webSocketClient.setOnAlert(() => {
            setModalVisible(true);
          });
        } catch {
          // 연결 실패 시에도 앱은 계속 진행
        }

        // 4) 상대 시간 갱신 타이머 시작
        startTimer();

        // 5) 핵심 초기화 완료 → UI 노출
        setIsAppInitialized(true);

        // 6) UI 노출 후 백그라운드 태스크 실행(초기 렌더 부담 완화)
        setTimeout(() => executeBackgroundTasks(), 100);
      } catch {
        // 핵심 초기화 실패 시에도 스플래시는 종료하여 사용자에게 UI를 보여줌
        setIsAppInitialized(true);
      }
    };

    initializeApp();

    // 정리(cleanup): 앱 언마운트 시 연결/타이머 정리
    return () => {
      webSocketClient.disconnect();
      stopTimer();
    };
  }, [executeBackgroundTasks, setModalVisible, startTimer, stopTimer]);

  // ---------------------------------------------------------------------------
  // 스플래시 노출
  // ---------------------------------------------------------------------------
  if (!isAppInitialized) {
    return <SplashScreen onInitializationComplete={handleSplashComplete} />;
  }

  // ---------------------------------------------------------------------------
  // 실제 화면 렌더링
  // ---------------------------------------------------------------------------
  return <Slot />;
}

/* =============================================================================
   RootLayout
   - SafeAreaProvider / Portal Host / Modal Provider 래핑
   ============================================================================= */

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Host>
        <ModalProvider>
          <RootLayoutContent />
        </ModalProvider>
      </Host>
    </SafeAreaProvider>
  );
}

/* =============================================================================
   Helpers
   ============================================================================= */

// ▸ 간단한 지연 유틸
function wait(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

// ▸ 인증 토큰 확인(샘플: 실제 구현에 맞게 교체)
async function checkAuthToken() {
  await wait(100);
  // 실제 구현에서는 SecureStore/AsyncStorage, 서버 검증 등을 수행
  return null; // 토큰 없다고 가정
}
