// app/_layout.tsx
import { Slot } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Host } from 'react-native-portalize';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from '../components/common/splashScreen';
import { ModalProvider, useModal } from '../shared/api/modalContextApi';
import { useTimeStore } from '../shared/store/timeStore';
import { webSocketClient } from '../shared/websocket/client';
import NotificationModal from './(tabs)/notificationModal';

export const headerShown = false;

function RootLayoutContent() {
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setModalVisible } = useModal();
  
  // TimeStore 함수들 가져오기
  const startTimer = useTimeStore((state) => state.startTimer);
  const stopTimer = useTimeStore((state) => state.stopTimer);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('앱 초기화 시작...');

        // 사용자 인증 상태 확인
        const token = await checkAuthToken();
        setIsAuthenticated(!!token);

        // WebSocket 연결 초기화
        webSocketClient.connect();
        webSocketClient.setOnAlert((data) => {
          console.log('🚨 WebSocket 알림 수신:', data);
          setModalVisible(true);
        });

        // 타이머 시작
        startTimer();

        // 초기화 작업
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('앱 초기화 완료');
        setIsAppInitialized(true);

      } catch (error) {
        console.error('앱 초기화 실패:', error);
        setIsAppInitialized(true);
      }
    };

    initializeApp();

    // 앱 종료 시 타이머 정리
    return () => {
      webSocketClient.disconnect();
      stopTimer();
    };
  }, [setModalVisible, startTimer, stopTimer]);

  if (!isAppInitialized) {
    return <SplashScreen />;
  }

  return (
    <>
      <Slot />
      <NotificationModal />
    </>
  );
}

async function checkAuthToken() {
  return null;
}

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