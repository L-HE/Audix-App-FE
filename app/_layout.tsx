// app/_layout.tsx
import { Slot } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Host } from 'react-native-portalize';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from '../components/common/splashScreen';
import { ModalProvider, useModal } from '../shared/api/modalContextApi';
import { useTimeStore } from '../shared/store/timeStore';
import { performanceTracker } from '../shared/utils/performanceTracker';
import { webSocketClient } from '../shared/websocket/client';
import { initLoginScreenPreload } from './(auth)/login';

export const headerShown = false;

// ✅ 1. HeavyInitTasks 최적화: 백그라운드 처리
interface BackgroundTask {
  name: string;
  task: () => Promise<void>;
  priority: 'high' | 'medium' | 'low';
  required: boolean;
}

function RootLayoutContent() {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [backgroundTasksStatus, setBackgroundTasksStatus] = useState({
    completed: 0,
    total: 0,
    critical: false
  });
  
  const { setModalVisible } = useModal();
  const backgroundTasksRef = useRef<BackgroundTask[]>([]);
  const initializationStartedRef = useRef(false); // ✅ 중복 초기화 방지
  
  // TimeStore 함수들 가져오기
  const startTimer = useTimeStore((state) => state.startTimer);
  const stopTimer = useTimeStore((state) => state.stopTimer);

  // ✅ 백그라운드 작업 정의 (useCallback 제거 - 의존성 문제 해결)
  const defineBackgroundTasks = (): BackgroundTask[] => [
    {
      name: 'DatabaseInit',
      task: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('📊 데이터베이스 초기화 완료');
      },
      priority: 'high',
      required: false
    },
    {
      name: 'AnalyticsSetup',
      task: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('📈 분석 도구 설정 완료');
      },
      priority: 'medium',
      required: false
    },
    {
      name: 'CachePreload',
      task: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log('💾 캐시 프리로드 완료');
      },
      priority: 'low',
      required: false
    },
    {
      name: 'RemoteConfigFetch',
      task: async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
        console.log('🌐 원격 설정 동기화 완료');
      },
      priority: 'medium',
      required: false
    }
  ];

  // ✅ 백그라운드 작업 실행기 최적화
  const executeBackgroundTasks = useCallback(() => {
    if (backgroundTasksRef.current.length > 0) {
      console.log('⚠️ [Background] 이미 실행 중인 백그라운드 작업 있음 - 스킵');
      return;
    }

    const tasks = defineBackgroundTasks();
    backgroundTasksRef.current = tasks;
    
    setBackgroundTasksStatus({
      completed: 0,
      total: tasks.length,
      critical: false
    });

    console.log(`🚀 [Background] ${tasks.length}개 백그라운드 작업 시작`);
    performanceTracker.addEvent('BackgroundTasksStart');

    const highPriorityTasks = tasks.filter(t => t.priority === 'high');
    const mediumPriorityTasks = tasks.filter(t => t.priority === 'medium');
    const lowPriorityTasks = tasks.filter(t => t.priority === 'low');

    let completedCount = 0;

    const executeTaskBatch = async (taskBatch: BackgroundTask[], batchName: string) => {
      const batchStart = performance.now();
      
      await Promise.all(taskBatch.map(async (bgTask) => {
        try {
          const taskStart = performance.now();
          await bgTask.task();
          performanceTracker.addDuration(`Background_${bgTask.name}`, taskStart);
          
          completedCount++;
          setBackgroundTasksStatus(prev => ({
            ...prev,
            completed: completedCount
          }));
          
        } catch (error) {
          console.error(`❌ [Background] ${bgTask.name} 실패:`, error);
          performanceTracker.addEvent(`Background_${bgTask.name}_Error`);
        }
      }));
      
      performanceTracker.addDuration(`BackgroundBatch_${batchName}`, batchStart);
      console.log(`✅ [Background] ${batchName} 배치 완료 (${taskBatch.length}개)`);
    };

    // 단계별 실행
    executeTaskBatch(highPriorityTasks, 'High');
    setTimeout(() => executeTaskBatch(mediumPriorityTasks, 'Medium'), 50);
    setTimeout(() => executeTaskBatch(lowPriorityTasks, 'Low'), 200);

    performanceTracker.addEvent('BackgroundTasksInitiated');
  }, []); // ✅ 빈 의존성 배열

  // ✅ SplashScreen 완료 콜백
  const handleSplashComplete = useCallback(() => {
    console.log('✅ [SplashScreen] 완료 - LoginScreen으로 전환');
    performanceTracker.addEvent('SplashScreenCompleted');
    // 추가 처리가 필요하면 여기서
  }, []);

  // ✅ 초기화 로직 최적화
  useEffect(() => {
    // 중복 실행 방지
    if (initializationStartedRef.current) {
      console.log('⚠️ [App] 초기화 이미 시작됨 - 스킵');
      return;
    }
    
    initializationStartedRef.current = true;

    const initializeApp = async () => {
      try {
        performanceTracker.start('AppInitialization');
        console.log('앱 초기화 시작...');
        performanceTracker.addEvent('InitStart');

        // LoginScreen 에셋 조기 프리로딩
        initLoginScreenPreload();

        const criticalInitStart = performance.now();
        
        // 필수 초기화 작업들
        const authStart = performance.now();
        const token = await checkAuthToken();
        performanceTracker.addDuration('AuthCheck', authStart);
        setIsAuthenticated(!!token);

        const wsStart = performance.now();
        try {
          webSocketClient.connect();
          webSocketClient.setOnAlert((data) => {
            console.log('🚨 WebSocket 알림 수신:', data);
            setModalVisible(true);
          });
        } catch (wsError) {
          console.warn('⚠️ WebSocket 연결 실패 - 계속 진행:', wsError);
        }
        performanceTracker.addDuration('WebSocketInit', wsStart);

        const timerStart = performance.now();
        startTimer();
        performanceTracker.addDuration('TimerStart', timerStart);

        performanceTracker.addDuration('CriticalInit', criticalInitStart);
        
        performanceTracker.addEvent('InitComplete');
        console.log('📱 앱 핵심 초기화 완료 - UI 표시 준비');
        
        // ✅ UI 표시
        setIsAppInitialized(true);

        // ✅ 백그라운드 작업은 UI 표시 후 한 번만 시작
        setTimeout(() => {
          executeBackgroundTasks();
        }, 100);

        performanceTracker.addEvent('SplashScreenEnd');

      } catch (error) {
        console.error('앱 초기화 실패:', error);
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error);
        performanceTracker.addEvent('InitError', { error: errorMessage });
        setIsAppInitialized(true);
      }
    };

    initializeApp();

    // 정리 함수
    return () => {
      console.log('🔄 [App] 정리 함수 실행');
      webSocketClient.disconnect();
      stopTimer();
    };
  }, []); // ✅ 빈 의존성 배열로 1회만 실행

  // 로딩 중일 때 SplashScreen 표시
  if (!isAppInitialized) {
    return <SplashScreen onInitializationComplete={handleSplashComplete} />;
  }

  // ✅ LoginScreen 렌더링 준비 완료
  performanceTracker.addEvent('LoginScreenReady');

  return (
    <>
      <Slot />
    </>
  );
}

async function checkAuthToken() {
  const checkStart = performance.now();
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log(`🔐 토큰 체크 완료: ${(performance.now() - checkStart).toFixed(2)}ms`);
  return null;
}

export default function RootLayout() {
  const layoutStart = performance.now();
  
  useEffect(() => {
    const layoutEnd = performance.now();
    console.log(`🏗️ RootLayout 렌더링: ${(layoutEnd - layoutStart).toFixed(2)}ms`);
  }, [layoutStart]);

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